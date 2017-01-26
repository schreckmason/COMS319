import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.EventQueue;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;
import javax.swing.border.EmptyBorder;

public class ServerGUI extends JFrame
{
	private JPanel contentPane;
	private JTextField textField,textField2;
	private JTextArea chatArea;
	private String username = "Admin";
	
	private volatile boolean newMessage = false; 
	private String message;
	private Socket sock;

	/**
	 * Create the frame.
	 * @throws IOException 
	 * @throws UnknownHostException 
	 */
	public ServerGUI() throws UnknownHostException, IOException
	{
		setTitle("Server");
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
		lblMessage.setBounds(24, 172, 64, 14);
		contentPane.add(lblMessage);
		
		textField = new JTextField();
		textField.setBounds(77, 169, 114, 17);
		contentPane.add(textField);
		textField.setColumns(10);
		
		JButton btnSend = new JButton("Send");
		btnSend.setBounds(218, 168, 89, 23);
		contentPane.add(btnSend);
		
		JLabel lblMessage2 = new JLabel("Delete Message");
		lblMessage2.setBounds(14, 199, 164, 14);
		contentPane.add(lblMessage2);
		
		textField2 = new JTextField();
		textField2.setBounds(107, 199, 114, 17);
		contentPane.add(textField2);
		textField2.setColumns(10);
		
		JButton btnSend2 = new JButton("Delete");
		btnSend2.setBounds(228, 199, 89, 23);
		contentPane.add(btnSend2);
		sock=new Socket("localhost",1222);
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
		btnSend2.addActionListener(new ActionListener()
		{
			
			@Override
			public void actionPerformed(ActionEvent e)
			{
	
				
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
					try {
						runSendThread();
					} catch (IOException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				}
					
			}
		});
		textField2.addKeyListener(new KeyListener() 
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
					
					
				}
					
			}
		});
		
		JScrollPane scrollBar = new JScrollPane(chatArea);
		scrollBar.setLocation(24, 32);
		scrollBar.setSize(186,102);
		scrollBar.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS);
		contentPane.add(scrollBar);
	}
	
	public String getMessage(String in)
	{
		//poll for a new message
		while(!newMessage)
		{
			try
			{
				Thread.sleep(1);
				if(!in.equals("")){
					newMessage=true;
				}
			} catch (InterruptedException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		//new message 
		newMessage = false;
		return message;
	}
	
	public void recieveMessage(String message)
	{
		//new message received 
		EventQueue.invokeLater(new Runnable()
		{
			
			@Override
			public void run()
			{
				//update the text area
				chatArea.append(message);
				
				revalidate();				
			}
		});
	}
	public String getUser(){
		return "Server";
	}
	public String getMessage(){
		return textField.getText();
	}
	public void runSendThread() throws IOException{
		Thread senderThread = new Thread(new ServerSender(this,sock));
		senderThread.start();
	}
}

class ServerSender implements Runnable {
	ServerGUI sgi;
	Socket sock;
	PrintWriter pw;
	ServerSender(ServerGUI sgi, Socket sock){
		this.sgi=sgi;
		this.sock=sock;
	}
	//Does the message formatting and sending action
	//cgi is used for getter methods, sock is used for traffic
	public void run(){
			try {
				pw = new PrintWriter(new BufferedOutputStream(sock.getOutputStream()));
				String st = sgi.getUser()+" : "+sgi.getMessage();
				System.out.println(st);
				pw.println(st);
				pw.flush();
			} catch (IOException e) {
				e.printStackTrace();
			}
	}
	
	
}
