public interface AuthentificationHandler {
	void authenticated(ClientHandler ch);

	public void disconnect(ClientHandler ch);
}
