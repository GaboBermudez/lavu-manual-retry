-- Table: public.lastorderchecked

-- DROP TABLE public.lastorderchecked;

CREATE TABLE public.lastorderchecked
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999 CACHE 1 ),
    location character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "orderId" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    CONSTRAINT lastorderedchecked_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.lastorderchecked
    OWNER to postgres;


-- INSERT

INSERT INTO public.lastorderchecked(
	location, "orderId", "timestamp")
	VALUES ('SanJose', '0000-0000', '01-01-2022 00:00:00');