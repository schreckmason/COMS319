import java.net.*;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;
import java.io.*;

public class Server implements MessageHandler, AuthentificationHandler{
	private int msgCnt = 0;
	private ServerSocket serverSocket = null;
	private File logFile = new File("chat.txt");
	private ServerGUI frame;
	private Thread guiMessageThread;
	private ArrayList<ClientHandler> clients;
	private String imageName = "NOT_SET";

	public Server(int port) {
		try {
			System.out.println("Binding to port " + port + ", please wait  ...");
			serverSocket = new ServerSocket(port);
			System.out.println("Server started: " + serverSocket);

			clients = new ArrayList<>();

			frame = new ServerGUI(this);
			frame.setVisible(true);

			acceptClients();// TODO: Happening in main thread; Should we change
							// that?
		} catch (IOException ioe) {
			System.out.println("Can not bind to port " + port + ": " + ioe.getMessage());
		}
	}

	public static void main(String args[]) {
		new Server(1222);
	}

	private void acceptClients() {
		while (true) {
			try {
				Socket socket = serverSocket.accept();
				System.out.println("Client connected");
				ClientHandler client = new ClientHandler(socket, this, this);
				clients.add(client);
				Thread clientThread = new Thread(client);
				clientThread.start();
			} catch (IOException e) {
				System.out.println("Error server connection failed");
				System.exit(-1);
			}
		}

	}

	public void update(String received) {
		frame.recieveMessage(received);
	}

	public void messageReceived(String author, String message) {
		update(author + ": " + message);
		msgCnt++;
		logMessage(message, author);
		if (isAdmin(author) || author.equals("Server")) {
			broadcastMessage(author, message);
		} else {
			// if admin connected, send them the update
			for (ClientHandler ch : clients) {
				if (isAdmin(ch.clientName)) {
					ch.sendText(formatAdminMsg(author, message));
				}
			}
		}
	}

	public String formatAdminMsg(String author, String message) {
		return "(" + msgCnt + ") " + author + ": " + message;
	}

	public void broadcastMessage(String author, String message) {
		for (ClientHandler ch : clients) {
			if (isAdmin(ch.clientName)) {
				ch.sendText(formatAdminMsg(author, message));
			} else {
				ch.sendText(author + ": " + message);
			}
		}
	}

	// logs message to the log file with the following format: Author # message
	// needs to use class variables of logFile and msgCnt
	public void logMessage(String message, String author) {
		try {
			// Open log file, append, and close
			System.out.println(Thread.currentThread().getName());
			PrintWriter logWriter = new PrintWriter(new FileWriter(logFile, true));
			logWriter.println(msgCnt + " " + author + ": " + message);
			logWriter.close();
		} catch (IOException e) {
			System.out.println("Encountered problem logging to chat.txt");
		}
	}

	public void logImgMessage(File image, String author) {
		logMessage(image.getName(), author);
	}

	public String readLogToString() {
		String line, input = "";
		try {
			// input the file content to the String "input"
			BufferedReader br = new BufferedReader(new FileReader(logFile));

			// read in file
			while ((line = br.readLine()) != null)
				input += line + "\r\n";

			br.close();
		} catch (Exception e) {
			System.out.println("Problem reading file.");
			return null;
		}
		return input;
	}

	public boolean deleteLine(int lineNum) {
		boolean result = false;
		try {
			// input the file content to the String "input"
			BufferedReader br = new BufferedReader(new FileReader(logFile));
			String line, input = "";

			while ((line = br.readLine()) != null) {
				if (line.startsWith(lineNum + "")) {
					result = true;
				} else {
					input += line + "\r\n";
				}
			}
			br.close();

			// write the new String with the replaced line OVER the same file
			FileOutputStream fileOut = new FileOutputStream(logFile);
			fileOut.write(input.getBytes());
			fileOut.close();
		} catch (Exception e) {
			System.out.println("Problem reading file.");
		}
		return result;
	}

	@Override
	public void imageReceived(SocketHandler sh, BufferedImage image) {
		System.out.println("Image received");
		try {
			ImageIO.write(image, "jpg", new File(imageName));
		} catch (IOException e) {
			e.printStackTrace();
		}
		//TODO: Log file name
		//TODO: Save file with <sender’s name>+<received time>
	}

	@Override
	public void textReceived(SocketHandler sh, String received) {
		//TODO: See if additions needed here
		ClientHandler ch = (ClientHandler) sh;
		if (received.startsWith("Delete ") && ch.clientName.toUpperCase().equals("ADMIN")) {
			System.out.print("trying to delete");
			// Message format: Delete #
			deleteLine(Integer.parseInt(received.substring(7)));
		} else if(received.startsWith("incoming_image ")){
			imageName = received.substring(15);
		} else {
			messageReceived(ch.clientName, received);
		}
	}
	
	public boolean isAdmin(String name){
		return name.toUpperCase().equals("ADMIN");
	}

	// Called by one of this Server's SocketHandlers
	@Override
	public void authenticated(ClientHandler ch) {
		if (isAdmin(ch.clientName)) {
			// Fill in admin by sending messages for all chat so far
			System.out.println("Reading log to admin");
			ch.sendText(readLogToString());
		}
	}
	
	// Called by one of this Server's SocketHandlers
	@Override
	public void disconnect(ClientHandler ch) {
		try {
			ch.socket.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		clients.remove(ch);
	}
}

// 'Listens' for messages from the client
class ClientHandler extends SocketHandler {
	public String clientName;
	protected AuthentificationHandler authHandler;

	ClientHandler(Socket s, MessageHandler mh, AuthentificationHandler ah) {
		super(s, mh);
		this.clientName = ""; // Empty string represents no name yet
		this.authHandler = ah;
	}

	public void run() {
		Object firstMessage = null;
		try {
			firstMessage = in.readObject();
		} catch (IOException | ClassNotFoundException e) {
			e.printStackTrace();
			System.exit(-1);
		}
		if (firstMessage instanceof String) {
			this.clientName = (String) firstMessage;
			this.authHandler.authenticated(this);
		} else {
			System.out.println("First message received must be the name of the client.");
			System.exit(-1);
		}
		super.run();
		authHandler.disconnect(this);
	}
}