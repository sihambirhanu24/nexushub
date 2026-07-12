--
-- PostgreSQL database dump
--

\restrict 9TXEFkPdIIbcpwgwRlcO92TbJhFghIcb2dW9gBraggovelzbVL2FxOtVEdyAlVs

-- Dumped from database version 18.4 (Ubuntu 18.4-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: resources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resources (
    id integer NOT NULL,
    resource_code character varying(20) NOT NULL,
    name character varying(150) NOT NULL,
    category character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'available'::character varying NOT NULL,
    assigned_to integer,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT resources_category_check CHECK (((category)::text = ANY ((ARRAY['Laptop'::character varying, 'Desktop'::character varying, 'Printer'::character varying, 'Meeting Room'::character varying, 'Vehicle'::character varying, 'Projector'::character varying, 'Furniture'::character varying])::text[]))),
    CONSTRAINT resources_status_check CHECK (((status)::text = ANY ((ARRAY['available'::character varying, 'in-use'::character varying, 'maintenance'::character varying, 'unavailable'::character varying])::text[])))
);


ALTER TABLE public.resources OWNER TO postgres;

--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resources_id_seq OWNER TO postgres;

--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    department character varying(100),
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    must_change_password boolean DEFAULT true,
    phone character varying(20),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'manager'::character varying, 'staff'::character varying, 'viewer'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: work_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_requests (
    id integer NOT NULL,
    request_number character varying(20) NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    type character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    priority character varying(20) DEFAULT 'medium'::character varying NOT NULL,
    requested_by integer NOT NULL,
    assigned_to integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT work_requests_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))),
    CONSTRAINT work_requests_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in-progress'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))),
    CONSTRAINT work_requests_type_check CHECK (((type)::text = ANY ((ARRAY['Technical Support'::character varying, 'Equipment Request'::character varying, 'Software Installation'::character varying, 'Office Maintenance'::character varying])::text[])))
);


ALTER TABLE public.work_requests OWNER TO postgres;

--
-- Name: work_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.work_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_requests_id_seq OWNER TO postgres;

--
-- Name: work_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.work_requests_id_seq OWNED BY public.work_requests.id;


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: work_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_requests ALTER COLUMN id SET DEFAULT nextval('public.work_requests_id_seq'::regclass);


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resources (id, resource_code, name, category, status, assigned_to, created_at) FROM stdin;
9	PR-001	alka;la	Printer	unavailable	\N	2026-07-11 18:29:52.680105
10	LP-001	MacBook Pro M1	Laptop	available	\N	2026-07-11 18:30:26.221376
11	LP-002	wekwd	Laptop	available	\N	2026-07-11 18:30:37.551334
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, department, status, created_at, must_change_password, phone) FROM stdin;
2	Admin User	admin@example.com	$2b$10$3l8qqXi4QMwyZUYn9o2ZfOWUtxuCfLdp4ZhLyGgahExL8PikUmhLa	admin	IT	active	2026-07-09 12:27:32.861041	t	\N
6	cvbn	cvbn@gmail.com	$2b$10$Ah.Bsstw0vU27BjhVUwxP.UeZv.Dshh/G7zWiXj2vmTxvyRGRRqLm	staff	Finance	active	2026-07-10 12:34:25.469947	t	\N
7	saddaa	sihambirhanu4@gmail.com	$2b$10$PIW9cmq98FAM/pgtKNqs6uK4DHOr4zdzHMnpAGSB4BHueAQT45RBK	staff	HR	active	2026-07-11 08:39:04.860284	t	\N
5	wekwd	wekwdqo@gmail.com	$2b$10$qEMwCfqCtEKm1K9indLHqeBBTwbhOOAYMsOwW2Mssh0qMHzrC/m2C	staff	Finance	inactive	2026-07-10 09:50:35.845618	t	\N
8	ssti	sihambirhanu90@gmail.com	$2b$10$zp6jn9yKyfIYAz.NSB2iUOG98FAKCGhC8v0BEQ6.M9p6Gi.iGPPie	staff	Finance	active	2026-07-11 09:37:53.388817	t	\N
9	xkmalk	skajka@gmail.com	$2b$10$9NlPHOfuUidubJStf/f/8OJ5pkJpYYDeAplJTA/eKmqW45o/mN3lG	staff	IT	active	2026-07-11 16:34:55.428495	t	\N
10	akk	klasal@gmail.com	$2b$10$dJbbPDq8lhAzy4902wBweevQoGSrKDhKQiVbwSUS507rgjrttXLKS	staff	Operations	active	2026-07-11 16:38:29.996087	t	\N
11	siham b	si@gmail.com	$2b$10$bQOI6dfa8oiRuTYNjXpIy.m13gGeAKG1wF0e6QqQpioBkWxBXzAJC	manager	IT	active	2026-07-11 17:58:41.743491	t	\N
4	sihamsb	siham@gmail.com	$2b$10$Qo3sqpyRdEUUMGkyhVcEXetcq1B57frnK0qUTNBoMKTu7dTf43F1G	manager	IT	inactive	2026-07-10 09:19:33.433987	t	091173897373ejhejh
\.


--
-- Data for Name: work_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_requests (id, request_number, title, description, type, status, priority, requested_by, assigned_to, created_at, updated_at) FROM stdin;
17	REQ-0002	iojio	oko	Technical Support	pending	medium	2	\N	2026-07-11 16:49:47.018774	2026-07-11 16:49:47.018774
19	REQ-0003	jksnank	klqql	Technical Support	pending	medium	2	\N	2026-07-11 16:54:52.933597	2026-07-11 16:54:52.933597
21	REQ-0005	KLAJXlK	akl	Technical Support	pending	medium	4	\N	2026-07-11 17:26:15.324428	2026-07-11 17:26:15.324428
22	REQ-0006	iaK	POSk	Technical Support	completed	medium	2	\N	2026-07-11 17:54:08.630468	2026-07-11 18:08:36.055664
\.


--
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resources_id_seq', 11, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: work_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.work_requests_id_seq', 22, true);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: resources resources_resource_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_resource_code_key UNIQUE (resource_code);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: work_requests work_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_requests
    ADD CONSTRAINT work_requests_pkey PRIMARY KEY (id);


--
-- Name: work_requests work_requests_request_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_requests
    ADD CONSTRAINT work_requests_request_number_key UNIQUE (request_number);


--
-- Name: resources resources_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: work_requests work_requests_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_requests
    ADD CONSTRAINT work_requests_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: work_requests work_requests_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_requests
    ADD CONSTRAINT work_requests_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO nexushub_admin;


--
-- Name: TABLE resources; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.resources TO nexushub_admin;


--
-- Name: SEQUENCE resources_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.resources_id_seq TO nexushub_admin;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO nexushub_admin;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO nexushub_admin;


--
-- Name: TABLE work_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.work_requests TO nexushub_admin;


--
-- Name: SEQUENCE work_requests_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.work_requests_id_seq TO nexushub_admin;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO nexushub_admin;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO nexushub_admin;


--
-- PostgreSQL database dump complete
--

\unrestrict 9TXEFkPdIIbcpwgwRlcO92TbJhFghIcb2dW9gBraggovelzbVL2FxOtVEdyAlVs

