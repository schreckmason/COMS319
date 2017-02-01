import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.filechooser.FileNameExtensionFilter;

import java.util.Random;

public class ImageViewer extends JFrame {
	private String user;
	private JPanel contentPane;
	private JTextArea chatArea;
	private File imgFile;
	private ImgClient imageClient;

	ImageViewer(String username, ImgClient imageClient) throws IOException {
		user = username;
		this.imageClient = imageClient;

		setTitle(user + " Image Selector");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		setBounds(200, 200, 600, 600);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);

		// creates send button
		JButton btnSend = new JButton("Send");
		btnSend.setBounds(420, 200, 89, 23);
		contentPane.add(btnSend);
		
		// creates send button
		JButton btnNewImg = new JButton("New Image");
		btnSend.setBounds(420, 240, 120, 23);
		contentPane.add(btnNewImg);

		// create chat area, needs to be updated when a server sends a message
		chatArea = new JTextArea();
		chatArea.setForeground(Color.BLACK);
		chatArea.setFont(new Font("Tahoma", Font.PLAIN, 13));
		chatArea.setEnabled(false);
		chatArea.setBounds(380, 50, 167, 108);
		chatArea.setLineWrap(true);
		contentPane.add(chatArea);

		JFileChooser fc = new JFileChooser();
		FileNameExtensionFilter filter = new FileNameExtensionFilter("JPG Images", "jpg");
		fc.setFileFilter(filter);

		if (fc.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
			imgFile = fc.getSelectedFile();
			// it must be an image file, otherwise you'll get an exception
			BufferedImage img = ImageIO.read(imgFile);

			// display image
			JLabel label = new JLabel();
			label.setIcon(new ImageIcon(img));
			label.setBounds(50, 50, 300, 300);
			contentPane.add(label);
			
		}

		btnSend.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				imageClient.socketHandler.sendImage(imgFile);
				receiveMessage(user + ": " + imgFile.getName());
			}
		});
	}

	public void receiveMessage(String received)
	{
		chatArea.append(received + "\n");
	}
}