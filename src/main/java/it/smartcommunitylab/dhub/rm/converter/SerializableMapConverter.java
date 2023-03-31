package it.smartcommunitylab.dhub.rm.converter;

import java.io.Serializable;

public class SerializableMapConverter extends MapConverter<Serializable> {

    protected SerializableMapConverter() {
        super(Serializable.class);
    }
}
