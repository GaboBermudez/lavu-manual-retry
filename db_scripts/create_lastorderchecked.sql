-- Table: public.lastorderchecked

-- DROP TABLE public.lastorderchecked;

CREATE TABLE public.lastorderchecked
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9999999 CACHE 1 ),
    "orderId" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    CONSTRAINT lastorderchecked_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.lastorderchecked
    OWNER to postgres;
