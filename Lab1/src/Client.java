package mason;

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
	private Thread thread = null;
	private String username;
	private ChatGUI frame;

	public Client(String ipAddr, String username, int serverPort)
	{
		this.username = username;
		
		try
		{
			socket = new Socket(ipAddr, serverPort);
			start();
		} catch (UnknownHostException h)
		{
			JOptionPane.showMessageDialog(new JFrame(), "Unknown Host " + h.getMessage());
			System.exit(1);
		} catch (IOException e)
		{
			JOptionPane.showMessageDialog(new JFrame(), "IO exception: " + e.getMessage());
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
		frame.recieveMessage(msg);
	}

	public void start() throws IOException
	{
		frame = new ChatGUI(username);
		frame.setVisible(true);
		authClient();
		//addThread(socket);
		
	}
	
	//Method to send solely the clients user to the server on start doesn't require input
	public void authClient() throws IOException{
		PrintWriter pw= new PrintWriter(new BufferedOutputStream(socket.getOutputStream()));
		pw.println(username);
		pw.flush();
	}
	
	public void update(String recieved){
		frame.recieveMessage(recieved);
	}
}