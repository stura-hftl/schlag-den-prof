package eu.wltr.schlagdenprof;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.websocket.DeploymentException;

import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.grizzly.http.server.StaticHttpHandler;
import org.glassfish.grizzly.http.server.StaticHttpHandlerBase;
import org.glassfish.tyrus.server.Server;

public class SchlagDenProf {

	public static final int HTTP_PORT = 8024;
	public static final int WS_PORT = 8025;
	public static final String STATIC_DIR = "schlagdenprof/";

	public static void main(String[] args) throws DeploymentException,
			IOException {

		Path dataPath;
		if (args.length > 0)
			dataPath = Paths.get(args[0]);
		else {
			System.err.println("No data path given. Using cwd.");
			dataPath = Paths.get("");
		}

		SchlagDenProf fight = new SchlagDenProf(dataPath.toAbsolutePath());
		fight.start();

		BufferedReader reader = new BufferedReader(new InputStreamReader(
				System.in));

		try {
			do {
				System.out.println("Please type 'exit' to stop the server.");
			} while (!"exit".equals(reader.readLine()));

		} finally {
			fight.stop();

		}

	}

	private HttpServer httpServer;
	private Server wsServer;
	private Path dataPath;

	public SchlagDenProf(Path dataPath) {
		this.dataPath = dataPath;
		System.out.println(dataPath);

	}

	public void start() throws DeploymentException, IOException {
		// Starting two different servers is the easiest way to deliver static
		// data with Tyrus.
		startWs();
		startHttp();

	}

	private void startHttp() throws IOException {
		httpServer = HttpServer
				.createSimpleServer("/", HTTP_PORT);

		StaticHttpHandlerBase staticHandler = new FixedCLStaticHttpHandler(
				getClass().getClassLoader(), STATIC_DIR);
		StaticHttpHandlerBase dataHandler = new StaticHttpHandler(
				dataPath.toString());

		staticHandler.setFileCacheEnabled(false);
		dataHandler.setFileCacheEnabled(true);

		httpServer.getServerConfiguration()
				.addHttpHandler(dataHandler, "/data/");
		httpServer.getServerConfiguration().addHttpHandler(staticHandler, "/");

		httpServer.start();

	}

	private void startWs() throws DeploymentException {
		DataBusEndpoint.data = new Data(dataPath); // HACK
		wsServer = new Server("0.0.0.0", WS_PORT, "/schlagdenprof",
				null, DataBusEndpoint.class);

		wsServer.start();

	}

	public void stop() {
		wsServer.stop();
		httpServer.shutdownNow();

	}

}
