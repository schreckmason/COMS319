//package lab3;

import java.net.*;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

import javax.management.RuntimeErrorException;

import java.io.*;

public class Server implements Runnable
{
	
	private ServerSocket serverSocket = null;
	private Thread mainThread = null;
	private File file = new File("chat.txt");
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
		} catch (IOException ioe)
		{
			System.out.println("Can not bind to port " + port + ": " + ioe.getMessage());
		}
	}

	public void run()
	{
		//TODO wait for a client or show error
		
	}

	public void start()
	{
		frame = new ServerGUI();
		frame.setVisible(true);
		//TODO launch a thread to read for new messages by the server
	
	}
	
	public void stop()
	{
		//TODO
		
	}

	private int findClient(int ID)
	{
		//TODO Find Client
		

		return -1;
	}

	public synchronized void handle(String input)
	{
		// TODO new message, send to clients and then write it to history
	
		//TODO update own gui
		
	}

	public synchronized void remove(int ID)
	{
		//TODO get the serverthread, remove it from the array and then terminate it
		
	}

	private void addThread(Socket socket)
	{
		//TODO add new client
		
	}

	public static void main(String args[])
	{
		Server server = null;
		server = new Server(1222);
	}
	
	//logs message to the log file with the following format: Author # message
	//needs to use class variables of logFile and msgCnt
	public void logMessage(String message, String author){
		
	}
	
	public void logImgMessage(File image, String author){
		logMessage(image.getName(), author);
	}
}

class ListClientHandler implements Runnable {
	Socket s; // this is socket on the server side that connects to the CLIENT
	String name;
	Scanner in;
	PrintWriter out;
	
	ListClientHandler(Socket s, int n) {
		this.s = s;
		name = "";
		try {
			in = new Scanner(new BufferedInputStream(s.getInputStream()));
			out = new PrintWriter(new BufferedOutputStream(s.getOutputStream()));
			
			//wait for name message from client
			while(name == ""){
				if(in.next() == "name"){
					name = in.nextLine();
					if(name.contains(" ")){
						throw new Exception("Names cannot contain spaces.");
					};
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(1);
		} 
	}

	// This is the client handling code
	// This keeps running handling client requests 
	// after initially sending some stuff to the client
	public void run() { 
	}
	
	void handleRequest(String s) {
		System.out.println("server side: " + s);
	}
}