import java.awt.BorderLayout;
import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JTextArea;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;
import javax.swing.JButton;
import javax.swing.JScrollBar;
import javax.swing.JScrollPane;
import java.awt.Font;
import java.awt.Color;

public class ChatGUI extends JFrame
{

	private JPanel contentPane;
	private JTextField textField;
	private JTextField deleteField;
	private JTextArea chatArea;
	
	private volatile boolean newMessage = false; 
	private String message;
	private boolean isAdmin=false;
	
	private Socket sock = null;
	private String user="";
	private PrintWriter pdw;
	
	/**
	 * Create the frame.
	 * @throws IOException 
	 * @throws UnknownHostException 
	 */
	public ChatGUI(String username, Socket sock) throws UnknownHostException, IOException
	{
		user=username;
		this.sock = sock;
		setTitle("Client");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		chatArea = new JTextArea();
		chatArea.setForeground(Color.BLACK);
		chatArea.setFont(new Font("Tahoma", Font.PLAIN, 13));
		chatArea.setEnabled(false);
		chatArea.setBounds(19, 33, 167, 108);
		chatArea.setLineWrap(true);
		contentPane.add(chatArea);
		
		JLabel lblMessage = new JLabel("Message");
		lblMessage.setBounds(30, 172, 64, 14);
		contentPane.add(lblMessage);
		
		textField = new JTextField();
		textField.setBounds(90, 169, 114, 17);
		contentPane.add(textField);
		textField.setColumns(10);
		
		JButton btnSend = new JButton("Send");
		btnSend.setBounds(218, 168, 89, 23);
		contentPane.add(btnSend);
		
		if(username.toLowerCase().equals("admin")){
			isAdmin=true;
			//create field label
			JLabel delMessage = new JLabel("Message ID");
			delMessage.setBounds(20, 195, 90, 14);
			contentPane.add(delMessage);
			
			//Create delete button
			JButton btnDel=new JButton("Delete");
			btnDel.setBounds(218, 195, 90, 23);
			contentPane.add(btnDel);
			
			//Create field to enter in message ID
			deleteField = new JTextField();
			deleteField.setBounds(90, 195, 114, 17);
			contentPane.add(deleteField);
			deleteField.setColumns(10);
		
			btnDel.addActionListener(new ActionListener()
			{
				
				@Override
				public void actionPerformed(ActionEvent e)
				{
					try {
						runDelThread();
					} catch (IOException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}

					
				}
			});
		}
		

		
		//when btnsend pressed, send the message
		btnSend.addActionListener(new ActionListener()
		{
			
			@Override
			public void actionPerformed(ActionEvent e)
			{
				try {
					runSendThread();
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}

				
			}
		});
		
		//allow for hitting enter to send a chat message
		textField.addKeyListener(new KeyListener() 
		{
			
			@Override
			public void keyTyped(KeyEvent e) 
			{
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void keyReleased(KeyEvent e) 
			{
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void keyPressed(KeyEvent e) 
			{
				if(e.getKeyCode() == KeyEvent.VK_ENTER)
				{
					// TODO when user press Enter the message should be submit.
					try {
						runSendThread();
					} catch (IOException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}

					
				}
					
			}
		});
		
		JScrollPane scrollBar = new JScrollPane(chatArea);
		scrollBar.setLocation(24, 32);
		scrollBar.setSize(186,102);
		scrollBar.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS);
		contentPane.add(scrollBar);
		
		
	}
	
	public String getMessage()
	{
		// TODO poll for a new message
		if(!textField.getText().equals(null)){
			message = textField.getText();
		}
		else { message = "no msg"; }
		return message;

	}
	
	public void recieveMessage(String received)
	{
		// TODO new message received append message to chatArea
		chatArea.append(received + "\n");
	
	}
	
	//Used to preface messages with the user supplied by spawning new ChatGUI in client
	public String getUser(){
		return user;
	}
	
	public String getDelMsg(){
		return deleteField.getText();
		
	}
	
	//Method used to create and start a new thread using Sender, called on button click or 'enter'
	public void runSendThread() throws IOException{
		Thread senderThread = new Thread(new Sender(this,sock));
		senderThread.start();
	}
	
	public void runDelThread() throws IOException{
		Thread delThread = new Thread(new AdminDelete(isAdmin, this, sock));
		delThread.start();
	}
}

class AdminDelete implements Runnable{
	boolean isAdmin;
	ChatGUI cgi;
	Socket sock;
	PrintWriter pw;
	AdminDelete(boolean isAdmin, ChatGUI cgi, Socket sock){
		this.isAdmin=isAdmin;
		this.cgi=cgi;
		this.sock=sock;
	}
	public void run(){
		try{
			pw=new PrintWriter(new BufferedOutputStream(sock.getOutputStream()));
			String delMsg = "Delete "+cgi.getDelMsg();
			pw.println(delMsg);
			pw.flush();
		}catch(IOException e){
			e.printStackTrace();
		}
	}
}

class Sender implements Runnable {
	ChatGUI cgi;
	Socket sock;
	PrintWriter pw;
	Sender(ChatGUI cgi, Socket sock){
		this.cgi=cgi;
		this.sock=sock;
	}
	//Does the message formatting and sending action
	//cgi is used for getter methods, sock is used for traffic
	public void run(){
			try {
				pw = new PrintWriter(new BufferedOutputStream(sock.getOutputStream()));
				String st = cgi.getMessage();
				System.out.println(st);
				pw.println(st);
				pw.flush();
			} catch (IOException e) {
				e.printStackTrace();
			}
	}
	
	
}