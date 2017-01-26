import java.net.*;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

import java.io.*;

public class Server implements Runnable
{

	private int msgCnt;
	private ServerSocket serverSocket = null;
	private Thread mainThread = null;
	private File logFile = new File("chat.txt");
	private PrintWriter writer;
	private ServerGUI frame;
	private Thread guiMessageThread;

	public Server(int port)
	{
		//TODO Binding and starting server
		try
		{
			System.out.println("Binding to port " + port + ", please wait  ...");
			serverSocket = new ServerSocket(port);
			System.out.println("Server started: " + serverSocket);
			start();
			run();
		} catch (IOException ioe)
		{
			System.out.println("Can not bind to port " + port + ": " + ioe.getMessage());
		}
	}

	public void run()
	{
		//TODO wait for a client or show error
		try{
			addThread(new Socket("localhost",1222));
		}catch(IOException e){
			e.printStackTrace();
		}

	}

	public void start() throws UnknownHostException, IOException
	{
		frame = new ServerGUI();
		frame.setVisible(true);
		//TODO launch a thread to read for new messages by the server
		
	}
	

	private void addThread(Socket socket)
	{
		while(true) {
			try{
				socket=serverSocket.accept();
				Thread validCon = new Thread(new ClientHandler(this,socket));
				validCon.start();
			}catch(IOException e){
				System.out.println("Error server connection failed");
				System.exit(-1);
			}
		}

	}
	
	public void update(String received){
		frame.recieveMessage(received);
	}
	
	//logs message to the log file with the following format: Author # message
	//needs to use class variables of logFile and msgCnt
	public void logMessage(String message, String author){
		try {
			// Open log file, append, and close
			PrintWriter logWriter = new PrintWriter(new FileWriter(logFile, true));
			logWriter.println(author + (msgCnt++) + message);
			logWriter.close();
		} catch (IOException e) {
			System.out.println("Encountered problem logging to chat.txt");
		}
	}
	
	public void logImgMessage(File image, String author){
		logMessage(image.getName(), author);
	}
	
	public void deleteMessage(int i){
		
	}

	public static void main(String args[])
	{
		Server server = new Server(1222);
	}
}

//'Listens' for messages from the client
class ClientHandler implements Runnable {
	Server serv;
	Socket s;
	String name;
	
	Scanner in;
	PrintWriter out;
	
	ClientHandler(Server serv, Socket s){
		this.s=s;
		this.serv=serv;
		try{
			in = new Scanner(new BufferedInputStream(s.getInputStream()));
			out = new PrintWriter(new BufferedOutputStream(s.getOutputStream()));
		}catch(IOException e){
			System.out.println("Error");
		}
		
		//wait for name message from client
		while(name == ""){
			name = in.nextLine();
			if(name.contains(" ")){
				System.out.println("Error: Name should not contain spaces.");
			};
		}
	}
	public void run(){
			while(true){
				String st=in.nextLine();
				serv.update(st+"\n");
			}
	}
}