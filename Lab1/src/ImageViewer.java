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
	
ImageViewer(String username, ImgClient imageClient) throws IOException{
	user=username;
	this.imageClient = imageClient;
	
	setTitle(user+" Image Selector");
	setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

	setBounds(200, 200, 600, 600);
	contentPane = new JPanel();
	contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
	setContentPane(contentPane);
	contentPane.setLayout(null);

	//creates send button
	JButton btnSend = new JButton("Send");
	btnSend.setBounds(420, 200, 89, 23);
	contentPane.add(btnSend);
	
	//create chat area, needs to be updated when a server sends a message
	chatArea = new JTextArea();
	chatArea.setForeground(Color.BLACK);
	chatArea.setFont(new Font("Tahoma", Font.PLAIN, 13));
	chatArea.setEnabled(false);
	chatArea.setBounds(380, 50, 167, 108);
	chatArea.setLineWrap(true);
	contentPane.add(chatArea);

	JFileChooser fc = new JFileChooser();
    FileNameExtensionFilter filter = new FileNameExtensionFilter(
            "JPG Images", "jpg");
    fc.setFileFilter(filter);
    
    if(fc.showOpenDialog(this) == JFileChooser.APPROVE_OPTION){
    	imgFile = fc.getSelectedFile();
        BufferedImage img = ImageIO.read(imgFile);//it must be an image file, otherwise you'll get an exception
        
        // display image
        JLabel label = new JLabel();
        label.setIcon(new ImageIcon(img));
        label.setBounds(50,50,300,300);
        contentPane.add(label);
    }
    
//    filename=getSelectedFileWithExtension(fc).toString();

	btnSend.addActionListener(new ActionListener()
	{
		@Override
		public void actionPerformed(ActionEvent e)
		{
			imageClient.socketHandler.sendImage(imgFile);
//			addThread(); //this spawns a thread to send the actual image (shows up in strange symbols currently in server, need to account for this in loggin)
//			PrintWriter pw;
//			try {
//				pw = new PrintWriter(new BufferedOutputStream(socket.getOutputStream()));
//				pw.println(username+" : "+filename);
//				pw.flush();
//			} catch (IOException e1) {
//				e1.printStackTrace();
//			}
		}
	});
}

////Got from stack overflow -- gets the file name that was chosen in the swing file chooser
//public static File getSelectedFileWithExtension(JFileChooser c) {
//    File file = c.getSelectedFile();
//    if (c.getFileFilter() instanceof FileNameExtensionFilter) {
//        String[] exts = ((FileNameExtensionFilter)c.getFileFilter()).getExtensions();
//        String nameLower = file.getName().toLowerCase();
//        for (String ext : exts) { // check if it already has a valid extension
//        	System.out.println(ext);
//            if (nameLower.endsWith('.' + ext.toLowerCase())) {
//                return file; // if yes, return as-is
//            }
//        }
//        // if not, append the first extension from the selected filter
//        file = new File(file.toString() + '.' + exts[0]);
//    }
//    return file;
//}
}

////Kick off communication to server
//public void addThread(){
//	Thread th= new Thread(new ImageSender(this,socket,outFile));
//	th.start();
//}

//Sends the image via DataOutputStream, may need to change to ObjectOutputStream per Mitra's email
//class ImageSender implements Runnable {
//	ImageViewer iv;
//	Socket sock;
//	File file;
//	ImageSender(ImageViewer iv, Socket sock, File file){
//		this.iv=iv;
//		this.sock=sock;
//		this.file=file;
//	}
//	
//	//Sends the actual image to the server -- to be saved by the server to images folder
//	//See Mitra's email to change this if you desire
//	public void run(){
//		int i;
//		    FileInputStream fis;
//			try {
//				fis = new FileInputStream (file);
//				DataOutputStream os=new DataOutputStream(sock.getOutputStream());
//				while ((i = fis.read()) > -1){
//				    os.write(i);
//				}
//			    fis.close();
//			    os.close();
//			    sock.close();
//			} catch (FileNotFoundException e) {
//				e.printStackTrace();
//			} catch (IOException e) {
//				e.printStackTrace();
//			}
//
//
//		}
//	}	
//}