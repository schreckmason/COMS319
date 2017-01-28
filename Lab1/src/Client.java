import java.net.*;
import java.util.Scanner;

import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JOptionPane;

import java.awt.EventQueue;
import java.io.*;

public class Client implements Runnable
{
	private Socket socket = null;
	private Thread listenerThread;
	private String username;
	private ChatGUI chatGui;
	private PrintWriter pw;
	

	public Client(String ipAddr, String username, int serverPort)
	{
		this.username = username;
		try
		{
			socket = new Socket(ipAddr, serverPort);
			pw = new PrintWriter(new BufferedOutputStream(socket.getOutputStream()));
			listenerThread = new Thread(new MessageListener(socket, this));
			listenerThread.start();
			start();
		} catch (Exception e)
		{
			JOptionPane.showMessageDialog(new JFrame(), "Unknown Host " + e.getMessage());
			System.exit(1);
		}
	}

	public void run()
	{
		//TODO check for a new message, once we receive it, steamOut will send it to the server
		//frame.getMessage();
	}
	

	public synchronized void handleChat(String msg)
	{
		//TODO
		chatGui.recieveMessage(msg);
	}

	public void start() throws IOException
	{
		//depending on option, open up image GUI or message GUI
	
		chatGui = new ChatGUI(username, socket);
		chatGui.setVisible(true);
		authClient();
		//addThread(socket);
	}
	
	//Method to send solely the clients user to the server on start doesn't require input
	public void authClient() throws IOException{
		pw.println(username);
		System.out.println("Sending name: " + username);
		pw.flush();
	}
	
	public void handleMessage(String msg){
		chatGui.recieveMessage(msg);
	}
	
	// Start of nested class 
	class MessageListener implements Runnable{
		
		Scanner in;
		Client client;
		
		private MessageListener(Socket sock, Client client) {
			try {
				in = new Scanner(new BufferedInputStream(sock.getInputStream()));
			} catch (IOException e) {
				System.out.println("Error reading from socket.");
			}
			this.client = client;
		}
		
		@Override
		public void run() {
			while(true){
				System.out.println("Waiting for message from server.");
				String msg=in.nextLine();
				System.out.println("Received: " + msg);
				client.handleMessage(msg);
			}
		}
	}
}