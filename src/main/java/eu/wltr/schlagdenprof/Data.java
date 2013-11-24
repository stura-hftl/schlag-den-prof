package eu.wltr.schlagdenprof;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.io.Files;

public class Data {

	private final Map<Object, Object> data;
	private final ObjectMapper mapper;

	public Data() {
		mapper = new ObjectMapper();
		data = new HashMap<Object, Object>();

	}

	public Data(Path dataPath) {
		this();
		File game = dataPath.resolve("game.json").toFile();

		try {
			String json = Files.toString(game, Charset.forName("UTF-8"));
			System.out.println(json);
			merge(json);

		} catch (IOException e) {
			System.err.println("No 'game.json' file found.");
			System.err.println(e.getMessage());

		}


	}

	public void merge(String message) throws IOException {
		@SuppressWarnings("unchecked")
		HashMap<Object, Object> update = mapper.readValue(message,
				HashMap.class);

		synchronized (data) {
			merge(data, update);
		}

	}

	private void merge(Map<Object, Object> main, Map<Object, Object> update) {
		for (Object key : update.keySet()) {
			Object mainValue = main.get(key);
			Object updateValue = update.get(key);

			if (mainValue instanceof Map && updateValue instanceof Map) {
				@SuppressWarnings("unchecked")
				Map<Object, Object> mainSub = (Map<Object, Object>) mainValue;
				@SuppressWarnings("unchecked")
				Map<Object, Object> updateSub = (Map<Object, Object>) updateValue;

				merge(mainSub, updateSub);

			} else if (updateValue == null) {
				main.remove(key);

			} else {
				main.put(key, update.get(key));

			}

		}

	}

	public String toJson() {
		try {
			synchronized (data) {
				return mapper.writeValueAsString(data);

			}

		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return "{}";

		}
	}

}
