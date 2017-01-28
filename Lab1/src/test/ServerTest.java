import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.sql.SQLException;
import java.util.concurrent.TimeUnit;

public class ServerTest extends Thread {
	public static void main(String[] args) throws IOException, SQLException, ClassNotFoundException, Exception {
		ServerSocket serverSocket = new ServerSocket(6066);
		Socket socket = serverSocket.accept();
		SocketHandler socketHandler = new SocketHandler(socket);
		Thread t = new Thread(socketHandler);
		t.setDaemon(true);
		t.start();
		System.out.println("Waiting");
		while(t.isAlive()){}
	}
}