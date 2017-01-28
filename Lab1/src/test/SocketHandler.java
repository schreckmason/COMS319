import java.awt.image.BufferedImage;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.Socket;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageInputStream;

public class SocketHandler implements Runnable{
	Socket socket;
	DataInputStream textIn;
    DataOutputStream textOut;
	
	public SocketHandler(Socket s){
		this.socket = s;
		try {
			textIn = new DataInputStream(socket.getInputStream());
			textOut = new DataOutputStream(socket.getOutputStream());
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}
	
	public void sendText(String message){
		try {
			textOut.writeUTF(message);
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}
	
	public void sendImage(File imageFile) throws InterruptedException{
		try {
			BufferedImage img = ImageIO.read(imageFile);
			sendText("image");
			TimeUnit.SECONDS.sleep(3);
			ImageIO.write(img, "JPG", socket.getOutputStream());
			socket.getOutputStream().flush();
			System.out.println("stream flushed");
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}

	public void listenForMessages(){
		while(!socket.isClosed()){
			try {
				String message = textIn.readUTF();
				if(message.equals("image")){
					System.out.println("Waiting for image.");
					ImageInputStream iis = ImageIO.createImageInputStream(socket.getInputStream());
					System.out.println("ImageInputStream created");
					BufferedImage img = ImageIO.read(iis);
					System.out.println("Image received");
					imageReceived(img);
				} else {
					textReceived(message);
				}
			} catch (IOException e) {
				e.printStackTrace();
				System.exit(-1);
			}
		}
	}
	
	public void textReceived(String text){
		System.out.println(text);
	}
	
	public void imageReceived(BufferedImage image){
        File outputfile = new File("saved.jpg");
        try {
			ImageIO.write(image, "JPG", outputfile);
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}

	@Override
	public void run() {
		listenForMessages();
	}
}
