import java.awt.BorderLayout;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JLabel;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JTextField;
import javax.swing.JButton;

public class OptionGUI extends JFrame {
	private JPanel contentPane;
	private JTextField nameField;
	private String name;
	ImageViewer iv=null;

	/**
	 * Create the frame.
	 * A GUI for allowing user interaction to determine their session type, either image or text
	 */
	public OptionGUI(String username) {
		name=username;
		setTitle(username);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 200, 150);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel typelbl = new JLabel("Select a Message Option");
		typelbl.setFont(new Font("Tahoma", Font.BOLD, 14));
		typelbl.setBounds(20, 20, 300, 17);
		contentPane.add(typelbl);
		
		JButton clientButton = new JButton("Text");
		clientButton.setBounds(10, 64, 89, 23);
		contentPane.add(clientButton);
		
		JButton imageButton = new JButton("Image");
		imageButton.setBounds(100, 64, 89,23);
		contentPane.add(imageButton);
		
		//when the button is pressed, send the name to the client application and connect to the server
		clientButton.addActionListener(new ActionListener()
		{
			
			@Override
			public void actionPerformed(ActionEvent e)
			{		
				EventQueue.invokeLater(new Runnable() 
				{
					public void run() 
					{
						try
						{
							Client client = new Client("localhost", name, 1222);
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				});
				
				//dispose of this login page
				dispose();
				
			}
		});
		
		//when the button is pressed, open a new ImgClient which will prompt a file selector
		imageButton.addActionListener(new ActionListener()
		{
			
			@Override
			public void actionPerformed(ActionEvent e)
			{		
				EventQueue.invokeLater(new Runnable() 
				{
					public void run() 
					{
						try
						{
							ImgClient imgClient=new ImgClient("localhost",name,1222);
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				});
				
				dispose();
				
			}
		});
			
	}
}
