import java.awt.image.BufferedImage;

public interface MessageHandler {

	void imageReceived(SocketHandler sh, BufferedImage image);

	void textReceived(SocketHandler sh, String received);

}
