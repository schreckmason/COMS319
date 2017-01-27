import java.net.Socket;
import java.net.UnknownHostException;

import javax.swing.JFrame;
import javax.swing.JOptionPane;
import java.io.*;


public class ImgClient {
	private String username;
	private Socket socket;
	private ImageViewer imgGUI;
	
	public ImgClient(String ipAddr, String username, int port){
	this.username = username;
	
	try
	{
		socket = new Socket(ipAddr, port);
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
	
	public void start() throws IOException{
		imgGUI=new ImageViewer(username);
		imgGUI.setVisible(true);
		//authenticate();
	}
	public void authenticate() throws IOException{
		PrintWriter pw=new PrintWriter(new BufferedOutputStream(socket.getOutputStream()));
		pw.println(username+" : image mode");
		pw.flush();
		
	}

}
