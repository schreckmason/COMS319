//package lab3;

import java.net.*;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;
import java.util.concurrent.Semaphore;
import javax.management.RuntimeErrorException;

import java.io.*;

public class Server
{
	
	private ArrayList<ClientHandler> clients;
	private ServerSocket serverSocket = null;
	private Thread clientAccepter = null;
	private Semaphore updateSemaphore = new Semaphore(1);
	private PrintWriter out;
	
	private File logFile = new File("chat.txt");
	private int msgCnt;
	
	private ServerGUI frame;
	
//	private Thread guiMessageThread;

	public Server(int port)
	{
		try
		{
			// Making socket
			System.out.println("Binding to port " + port + ", please wait  ...");
			serverSocket = new ServerSocket(port);
			System.out.println("Server started: " + serverSocket);
			
			// GUI starting
			frame = new ServerGUI();
			frame.setVisible(true);
			
			//Starting Client Accepter Thread
			new Thread(new Runnable(){

				@Override
				public void run() {
					while (true) {
						Socket clientSocket = null;
						try {
							
							// WAIT FOR CLIENT TO TRY TO CONNECT TO SERVER
							clientSocket = serverSocket.accept();

							// SPAWN A THREAD TO HANDLE CLIENT REQUEST
							// TODO: Put in a thread since this constructor could wait.
							ClientHandler clientHandler = new ClientHandler(clientSocket, this);
							Thread chThread = new Thread(clientHandler);
							clients.add(clientHandler);
							chThread.start();
							
						} catch (IOException e) {
							System.out.println("Accept failed: 4444");
							System.exit(-1);
						}					
					}
				}	
			}).start();
		} catch (IOException ioe)
		{
			System.out.println("Can not bind to port " + port + ": " + ioe.getMessage());
		}
	}

//	public void run()
//	{
//		//TODO wait for a client or show error
//		
//	}
//	
//	public void stop()
//	{
//		//TODO
//		
//	}

	private int deleteClient(String clientToDelete)
	{
		//TODO: Check if I need to use an iterator instead
		for(ClientHandler ch:clients){
			if(ch.name == clientToDelete){
				clients.remove(ch);
			}
		}

		return -1;
	}

//	public synchronized void handle(String input)
//	{
//		// TODO new message, send to clients and then write it to history
//		//TODO update own gui
//	}

//	public synchronized void remove(int ID)
//	{
//		//TODO get the serverthread, remove it from the array and then terminate it
//		
//	}

//	private void addThread(Socket socket)
//	{
//		//TODO add new client
//		
//	}
	
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

	public static void main(String args[])
	{
		Server server = new Server(1222);
	}
}

class ClientHandler implements Runnable {
	Socket s; // this is socket on the server side that connects to the CLIENT
	public String name;
	private Scanner in;
	private PrintWriter out;
	private Server server;
	private boolean killHandler = false;
	ClientHandler(Socket s, Server server) {
		this.s = s;
		name = "";
		try {
			in = new Scanner(new BufferedInputStream(s.getInputStream()));
			out = new PrintWriter(new BufferedOutputStream(s.getOutputStream()));
			
			//wait for name message from client
			while(name == ""){
				name = in.nextLine();
				if(name.contains(" ")){
					System.out.println("Error: Name should not contain spaces.");
				};
			}
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(1);
		} 
	}

	public void run() { 
		while(!killHandler){
			String message = in.next();
			if(message == "delete" && in.hasNextInt()){
				sendDelete(in.nextInt());
			} else {
				message += in.nextLine();
			}
			handleRequest(message);
		}
	}
	
	void sendDelete(int line){
		
	}
	void handleRequest(String s) {
		if(name.toUpperCase() == "ADMIN"){
			if(s.startsWith("delete ")){
				
			}
		}
	}
}