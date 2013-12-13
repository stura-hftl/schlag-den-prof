package eu.wltr.schlagdenprof;

import org.glassfish.grizzly.http.server.CLStaticHttpHandler;
import org.glassfish.grizzly.http.server.Request;
import org.glassfish.grizzly.http.server.Response;

public class FixedCLStaticHttpHandler extends CLStaticHttpHandler {

	protected FixedCLStaticHttpHandler(ClassLoader classLoader,
			String... docRoots) {
		super(classLoader, docRoots);
	}

	@Override
	protected boolean handle(String resourcePath, Request request,
			Response response) throws Exception {
		if (resourcePath.isEmpty())
			resourcePath = resourcePath + "/";

		if (resourcePath.endsWith("/"))
			resourcePath = resourcePath + "index.html";

		return super.handle(resourcePath, request, response);

	}

}
