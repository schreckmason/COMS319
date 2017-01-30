import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;

import javax.swing.JFrame;
import javax.swing.JOptionPane;

public class Client implements MessageHandler
{
	private Socket socket = null;
	private Thread listenerThread;
	private String username;
	private ChatGUI chatGui;
	SocketHandler socketHandler;
	

	public Client(String ipAddr, String username, int serverPort)
	{
		this.username = username;
		try
		{
			socket = new Socket(ipAddr, serverPort);
			socketHandler = new SocketHandler(socket, this);
			listenerThread = new Thread(socketHandler);
			listenerThread.start();
			
			chatGui = new ChatGUI(username, this);
			chatGui.setVisible(true);
			
			authClient();
		} catch (Exception e)
		{
			JOptionPane.showMessageDialog(new JFrame(), "Unknown Host " + e.getMessage());
			System.exit(-1);
		}
	}
	
	//Method to send solely the client's user to the server on start doesn't require input
	public void authClient() throws IOException{
		socketHandler.sendText(username);
	}
	
	@Override
	public void imageReceived(SocketHandler sh, BufferedImage image) {
		// Not implemented because Server can't currently send images
	}

	@Override
	public void textReceived(SocketHandler sh, String received) {
		chatGui.recieveMessage(received);
	}
}