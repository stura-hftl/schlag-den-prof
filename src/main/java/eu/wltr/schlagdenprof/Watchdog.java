package eu.wltr.schlagdenprof;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Set;

import javax.websocket.Session;

public class Watchdog implements Runnable {

	private final Set<Session> sessions;

	public Watchdog(Set<Session> sessions) {
		this.sessions = sessions;

	}

	@Override
	public void run() {
		try {
			while (true) {
				for (Session session : sessions)
					session.getBasicRemote().sendPing(ByteBuffer.allocate(10));

				Thread.sleep(1000);
			}

		} catch (InterruptedException | IllegalArgumentException | IOException e) {
			e.printStackTrace();

		}

	}

}
