import java.net.Socket;
import java.net.UnknownHostException;

import javax.swing.JFrame;
import javax.swing.JOptionPane;

import java.awt.image.BufferedImage;
import java.io.*;


public class ImgClient implements MessageHandler{
	private String username;
	private Socket socket;
	SocketHandler socketHandler;
	private Thread listenerThread;
	private ImageViewer imgGUI;
	
	public ImgClient(String ipAddr, String username, int port){
		this.username = username;
		try
		{
			socket = new Socket(ipAddr, port);
			socketHandler = new SocketHandler(socket, this);
			listenerThread = new Thread(socketHandler);
			listenerThread.start();
			
			imgGUI = new ImageViewer(username, this);
			imgGUI.setVisible(true);
			
			authClient();
		} catch (Exception e)
		{
			JOptionPane.showMessageDialog(new JFrame(), e.getMessage());
			System.exit(-1);
		}
	}
	
	//Method to send solely the client's user to the server on start doesn't require input
	public void authClient() throws IOException{
		socketHandler.sendText(username);
	}

	@Override
	public void imageReceived(SocketHandler sh, BufferedImage image) {
		// Not implemented because only clients can send images
	}

	@Override
	public void textReceived(SocketHandler sh, String received) {
		imgGUI.receiveMessage(received);
	}
}
