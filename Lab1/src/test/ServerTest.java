import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.sql.SQLException;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;

public class ServerTest implements MessageHandler {
	public static void main(String[] args) throws IOException, SQLException, ClassNotFoundException, Exception {
		ServerSocket serverSocket = new ServerSocket(6066);
		Socket socket = serverSocket.accept();
		System.out.println("Client connected");
		SocketHandler socketHandler = new SocketHandler(socket, new ServerTest());
		Thread t = new Thread(socketHandler);
		t.start();
		
		socketHandler.sendText("This is what I have to say");
		System.out.println("text sent to client");
		
		socketHandler.sendText("message 2 from server");
		System.out.println("text sent to client");
		
		while(t.isAlive()){}
		System.out.println("Died");
	}

	@Override
	public void textReceived(SocketHandler sh, String text){
		System.out.println("Server received: " + text);
	}
	
	@Override
	public void imageReceived(SocketHandler sh, BufferedImage image){
		System.out.println("Server received image");
        File outputfile = new File("saved.jpg");
        try {
			ImageIO.write(image, "jpg", outputfile);
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}
}