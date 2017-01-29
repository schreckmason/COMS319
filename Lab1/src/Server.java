import java.net.*;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

import java.io.*;

public class Server
{

	private int msgCnt = 0;
	private ServerSocket serverSocket = null;
	private Thread mainThread = null;
	private File logFile = new File("chat.txt");
	private PrintWriter writer;
	private ServerGUI frame;
	private Thread guiMessageThread;
	private ArrayList<ClientHandler> clients;

	public Server(int port)
	{
		//TODO Binding and starting server
		try
		{
			System.out.println("Binding to port " + port + ", please wait  ...");
			serverSocket = new ServerSocket(port);
			System.out.println("Server started: " + serverSocket);
			clients = new ArrayList<>();
			frame = new ServerGUI(this);
			frame.setVisible(true);
			acceptClients();
		} catch (IOException ioe)
		{
			System.out.println("Can not bind to port " + port + ": " + ioe.getMessage());
		}
	}

	private void acceptClients()
	{
		while(true) {
			try{
				Socket socket=serverSocket.accept();
				System.out.println("Client connected");
				ClientHandler client = new ClientHandler(this,socket);
				clients.add(client);
				Thread clientThread = new Thread(client);
				clientThread.start();
			}catch(IOException e){
				System.out.println("Error server connection failed");
				System.exit(-1);
			}
		}

	}
	
	public void update(String received){
		frame.recieveMessage(received);
	}
	
	public void messageReceived(String author, String message){
		update(author + ": " + message);
		msgCnt++;
		logMessage(message, author);
		if(author.toUpperCase().equals("ADMIN") || author.equals("Server")){
			broadcastMessage(author, message);
		} else {
			//if admin connected, send them the update
			for(ClientHandler ch:clients){
				if(ch.name.toUpperCase().equals("ADMIN")){
					ch.sendMessage(formatAdminMsg(author, message));
				}
			}
		}
	}
	
	public String formatAdminMsg(String author, String message){
		return "(" + msgCnt + ") " + author + ": " + message;
	}
	
	public void broadcastMessage(String author, String message){
		for(ClientHandler ch:clients){
			if(ch.name.toUpperCase().equals("ADMIN")){
				ch.sendMessage(formatAdminMsg(author, message));
			} else {
				ch.sendMessage(author + ": " + message);
			}
		}
	}
	
	//logs message to the log file with the following format: Author # message
	//needs to use class variables of logFile and msgCnt
	public void logMessage(String message, String author){
		System.out.println("trying to log");
		try {
			// Open log file, append, and close
			System.out.println(Thread.currentThread().getName());
			PrintWriter logWriter = new PrintWriter(new FileWriter(logFile, true));
			logWriter.println(msgCnt + " " + author + " " + message);
			logWriter.close();
		} catch (IOException e) {
			System.out.println("Encountered problem logging to chat.txt");
		}
	}
	
	public void logImgMessage(File image, String author){
		logMessage(image.getName(), author);
	}
	
	public String readLogToString(){
        String line, input = "";
	    try {
	        // input the file content to the String "input"
	        BufferedReader br = new BufferedReader(new FileReader(logFile));
	        
	        //read in file
	        while ((line = br.readLine()) != null) input += line + "\r\n";
	        
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

	        while ((line = br.readLine()) != null){
	        	if(line.startsWith(lineNum + "")){
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
		this.name = ""; //Empty string represents no name yet
		try{
			in = new Scanner(new BufferedInputStream(s.getInputStream()));
			out = new PrintWriter(new BufferedOutputStream(s.getOutputStream()));
		}catch(IOException e){
			System.out.println("Error");
		}
		
		//wait for name message from client
//		System.out.println("Waiting for a name");
//		while(name == ""){
//
//			System.out.println("in loop");
//			name = in.nextLine();
//			if(name.contains(" ")){
//				System.out.println("Error: Name should not contain spaces.");
//			};
//		}
//		System.out.println("Received name for client: " + name);
	}
	public void run(){
		this.name = in.nextLine();
		System.out.println("Name set to: " + this.name);
		if(name.toUpperCase().equals("ADMIN")){
			sendAllMessages();
		}
		while(true){
			String msg=in.nextLine();
			System.out.println("Name: " + name+"; Msg: " +msg);
			handleMessage(msg);
		}
	}
	
	public void sendMessage(String message){
		System.out.println("Sending message to: " + name);
		out.println(message);
		out.flush();
	}
	
	public void handleMessage(String message){
		if(name.toUpperCase().equals("ADMIN")){
			System.out.print("admin sent message");
			if(message.startsWith("Delete ")){
				System.out.print("trying to delete");
				serv.deleteLine(Integer.parseInt(message.substring(7)));
			} else {
				serv.messageReceived(name, message);
			}
		} else {
			serv.messageReceived(name, message);
		}
	}
	
	// Fill in admin by sending messages for all chat so far
	public void sendAllMessages(){
		System.out.println("Reading log to admin");
		sendMessage(serv.readLogToString());
	}
}