DROP DATABASE IF EXISTS norbit;


CREATE DATABASE norbit WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';





CREATE TABLE public."Boats" (
    id integer NOT NULL,
    name text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    heading double precision NOT NULL,
    "time" timestamp without time zone DEFAULT (now())::timestamp without time zone
);






ALTER TABLE ONLY public."Boats" ALTER COLUMN id SET DEFAULT nextval('public."Boats_id_seq"'::regclass);


ALTER TABLE ONLY public."Boats"
    ADD CONSTRAINT "Boats_id_key" UNIQUE (id);




ALTER TABLE ONLY public."Boats"
    ADD CONSTRAINT boats_pk PRIMARY KEY (id);
