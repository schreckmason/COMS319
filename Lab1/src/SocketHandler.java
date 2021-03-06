import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;
import java.net.SocketException;

import javax.imageio.ImageIO;

public class SocketHandler implements Runnable{
	protected Socket socket;
	protected ObjectInputStream in;
    protected ObjectOutputStream out;
	protected MessageHandler msgHandler;
	
	public SocketHandler(Socket s, MessageHandler mh){
		this.socket = s;
		this.msgHandler = mh;
		try {
			out = new ObjectOutputStream(socket.getOutputStream());
			in = new ObjectInputStream(socket.getInputStream());
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}
	
	public void sendText(String message){
		try {
			out.writeObject(message);
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}
	
	public void sendImage(File imageFile){
		try {
			sendText("incoming_image " + imageFile.getName());
			
			// Read local file into a BufferedImage variable
			BufferedImage image = ImageIO.read(imageFile);
			// Convert BufferedImage to byte[]
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ImageIO.write(image, "jpg", baos);
		    byte [] imgBytes = baos.toByteArray();
		    // Send byte[] containing image
			out.writeObject(imgBytes);
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}

	public void listenForMessages() throws ClassNotFoundException, IOException{
		while(!socket.isClosed()){
			Object received;
			received = in.readObject();
			if(received instanceof String){
				msgHandler.textReceived(this, (String) received);
			} else if(received instanceof byte[]) {
				BufferedImage image = ImageIO.read(new ByteArrayInputStream((byte[]) received));
				msgHandler.imageReceived(this, image);
			} else {
				throw new IOException("Illegal message received.");
			}
		}
	}

	@Override
	public void run() {
		try {
			listenForMessages();
		} catch (ClassNotFoundException | IOException e) {
			e.printStackTrace();
		}
	}
}

