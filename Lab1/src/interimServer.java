//package lab3;

import java.net.*;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

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

	public synchronized void handle(String input) throws IOException
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
		int clientNum = 0;
		while(true) {
			try{
				socket=serverSocket.accept();
				System.out.println("Connected " + clientNum++);
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

	public static void main(String args[])
	{
		Server server = null;
		server = new Server(1222);
	}
}//end of Server

//'Listens' for messages from the client
class ClientHandler implements Runnable {
	Server serv;
	Socket s;
	ClientHandler(Server serv, Socket s){
		this.s=s;
		this.serv=serv;
	}
	public void run(){
		Scanner in;
		try{
			in=new Scanner(new BufferedInputStream(s.getInputStream()));
			String st = in.nextLine();
			System.out.println(st);
			serv.update(st);
		}catch(IOException e){
			e.printStackTrace();
		}
	}
}
	


