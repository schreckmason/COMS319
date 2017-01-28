import java.io.File;
import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.concurrent.TimeUnit;

public class ClientTest {
	public static void main(String[] args) throws UnknownHostException, IOException, InterruptedException {
		Socket socket = new Socket("localhost", 6066);
		SocketHandler socketHandler = new SocketHandler(socket);
		Thread t = new Thread(socketHandler);
		t.setDaemon(true);
		t.start();
//		socketHandler.sendText("Hope this works.");
//		System.out.println("sent text");
		socketHandler.sendImage(new File("test.jpg"));
		System.out.println("sent image");
		socketHandler.sendText("stuff");
		while(t.isAlive()){}
	}
}