import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;

public class ClientTest implements MessageHandler{
	public static void main(String[] args) throws UnknownHostException, IOException, InterruptedException {
		Socket socket = new Socket("localhost", 6066);
		SocketHandler socketHandler = new SocketHandler(socket, new ClientTest());
		Thread t = new Thread(socketHandler);
		t.start();
		
		socketHandler.sendText("first message from client");
		System.out.println("text sent");
		
		socketHandler.sendImage(new File("test.jpg"));
		System.out.println("image sent");
		
		socketHandler.sendText("another message");
		System.out.println("text sent");
		
		while(t.isAlive()){}
		System.out.println("Died");
	}

	@Override
	public void textReceived(SocketHandler sh, String text){
		System.out.println("Client received: " + text);
	}
	
	@Override
	public void imageReceived(SocketHandler sh, BufferedImage image){
		System.out.println("Client received image");
        File outputfile = new File("saved.jpg");
        try {
			ImageIO.write(image, "jpg", outputfile);
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}
}