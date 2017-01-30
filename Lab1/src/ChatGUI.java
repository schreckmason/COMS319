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
	
	private Client client;
	private String user;
	
	/**
	 * Create the frame.
	 * @throws IOException 
	 * @throws UnknownHostException 
	 */
	public ChatGUI(String username, Client client) throws UnknownHostException, IOException
	{
		user=username;
		this.client = client;
		
		setTitle(username);
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
		
		JScrollPane scrollBar = new JScrollPane(chatArea);
		scrollBar.setLocation(24, 32);
		scrollBar.setSize(186,102);
		scrollBar.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS);
		contentPane.add(scrollBar);
		
		if(username.toLowerCase().equals("admin")){
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
					sendDelCmd();
				}
			});
		}
		
		//when btnsend pressed, send the message
		btnSend.addActionListener(new ActionListener()
		{
			@Override
			public void actionPerformed(ActionEvent e)
			{
				sendMessage();
			}
		});
		
		//allow for hitting enter to send a chat message
		textField.addKeyListener(new KeyListener() 
		{
			@Override
			public void keyTyped(KeyEvent e) 
			{
			}
			@Override
			public void keyReleased(KeyEvent e) 
			{
			}
			@Override
			public void keyPressed(KeyEvent e) 
			{
				if(e.getKeyCode() == KeyEvent.VK_ENTER)
				{
					sendMessage();
				}
			}
		});
	}
	
	public void recieveMessage(String received)
	{
		chatArea.append(received + "\n");
	}
	
	public void sendMessage(){
		String message = textField.getText();
		if(message != null && !message.isEmpty()){
			System.out.println("");
			client.socketHandler.sendText(message);
		}
	}
	
	public void sendDelCmd(){
		client.socketHandler.sendText("Delete " + deleteField.getText());
	}
	
	//Used to preface messages with the user supplied by spawning new ChatGUI in client
	public String getUser(){
		return user;
	}
}