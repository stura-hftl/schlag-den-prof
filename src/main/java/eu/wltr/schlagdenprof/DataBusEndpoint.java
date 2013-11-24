package eu.wltr.schlagdenprof;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/databus", subprotocols = "schlagdenprof")
public class DataBusEndpoint {

	private static final Set<Session> sessions = new HashSet<Session>();
	public static Data data;
	private static Thread watchdog;

	public DataBusEndpoint() {
		if (watchdog == null || !watchdog.isAlive()) {
			watchdog = new Thread(new Watchdog(sessions));
			watchdog.start();
		}
	}

	@OnOpen
	public void onOpen(Session session) throws IOException {
		System.out.println("Session opened.");
		sessions.add(session);

	}

	@OnMessage
	public void onMessage(String message) {
		try {
			data.merge(message);
			String json = data.toJson();
			for (Session s : sessions)
				s.getAsyncRemote().sendText(json);

		} catch (IOException e) {
			e.printStackTrace();

		}

	}

	@OnError
	public void onError(Throwable t) {
		t.printStackTrace();

	}

	@OnClose
	public void onClose(Session session) {
		System.out.println("Session closed.");
		sessions.remove(session);

	}
}
