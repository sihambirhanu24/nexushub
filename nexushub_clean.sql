--
-- PostgreSQL database dump
--

\restrict cRrhxLNgjoU1uj3Zr8vS2klZanHopb3Tyb280Wdn7E7sWsJ5F8g8ZKHNU6gHWwu

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
-- Name: resources; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: work_requests; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: work_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.work_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: work_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.work_requests_id_seq OWNED BY public.work_requests.id;


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: work_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_requests ALTER COLUMN id SET DEFAULT nextval('public.work_requests_id_seq'::regclass);


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resources (id, resource_code, name, category, status, assigned_to, created_at) FROM stdin;
9	PR-001	alka;la	Printer	unavailable	\N	2026-07-11 18:29:52.680105
11	LP-002	wekwd	Laptop	available	\N	2026-07-11 18:30:37.551334
12	LP-003	MacBook Pro M9	Laptop	available	\N	2026-07-13 11:02:33.559117
13	LP-004	MacBook Pro M9	Laptop	available	\N	2026-07-13 11:02:53.307986
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, role, department, status, created_at, must_change_password, phone) FROM stdin;
6	cvbn	cvbn@gmail.com	$2b$10$Ah.Bsstw0vU27BjhVUwxP.UeZv.Dshh/G7zWiXj2vmTxvyRGRRqLm	staff	Finance	active	2026-07-10 12:34:25.469947	t	\N
7	saddaa	sihambirhanu4@gmail.com	$2b$10$PIW9cmq98FAM/pgtKNqs6uK4DHOr4zdzHMnpAGSB4BHueAQT45RBK	staff	HR	active	2026-07-11 08:39:04.860284	t	\N
5	wekwd	wekwdqo@gmail.com	$2b$10$qEMwCfqCtEKm1K9indLHqeBBTwbhOOAYMsOwW2Mssh0qMHzrC/m2C	staff	Finance	inactive	2026-07-10 09:50:35.845618	t	\N
8	ssti	sihambirhanu90@gmail.com	$2b$10$zp6jn9yKyfIYAz.NSB2iUOG98FAKCGhC8v0BEQ6.M9p6Gi.iGPPie	staff	Finance	active	2026-07-11 09:37:53.388817	t	\N
9	xkmalk	skajka@gmail.com	$2b$10$9NlPHOfuUidubJStf/f/8OJ5pkJpYYDeAplJTA/eKmqW45o/mN3lG	staff	IT	active	2026-07-11 16:34:55.428495	t	\N
10	akk	klasal@gmail.com	$2b$10$dJbbPDq8lhAzy4902wBweevQoGSrKDhKQiVbwSUS507rgjrttXLKS	staff	Operations	active	2026-07-11 16:38:29.996087	t	\N
11	siham b	si@gmail.com	$2b$10$bQOI6dfa8oiRuTYNjXpIy.m13gGeAKG1wF0e6QqQpioBkWxBXzAJC	manager	IT	active	2026-07-11 17:58:41.743491	t	\N
2	Admin User	admin@example.com	$2b$10$nSEiPTi/J.LVsF4GrbdJlOPEst/CeLGV08212IaI00Ts7uV8D9UFq	admin	IT	active	2026-07-09 12:27:32.861041	t	\N
12	yonas	yonas@gmail.coom	$2b$10$t9XcNwzNZ5nwwhjl8cXEQ.sf8Z1xvTcohim5p7ofroILD9aCnRNYG	staff	Finance	active	2026-07-13 06:48:31.251134	t	\N
4	siham	siham@gmail.com	$2b$10$Qo3sqpyRdEUUMGkyhVcEXetcq1B57frnK0qUTNBoMKTu7dTf43F1G	manager	IT	inactive	2026-07-10 09:19:33.433987	t	091173898878
14	sami	sami@gmail.com	$2b$10$MIKlT0R/J1SPV7udvjgIwubJSw6FBVmDHHMlDnTuBAQVoD8H/QmEa	staff	IT	active	2026-07-13 11:00:58.411121	t	\N
13	yiduuhh	yidu@gmail.com	$2b$10$5m5g667O7nqlK9sRgtH/6.7xfN9Z3/7xYPG3/D2EbNG.UsphsypbC	staff	HR	active	2026-07-13 09:50:12.229848	t	\N
\.


--
-- Data for Name: work_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.work_requests (id, request_number, title, description, type, status, priority, requested_by, assigned_to, created_at, updated_at) FROM stdin;
17	REQ-0002	iojio	oko	Technical Support	pending	medium	2	\N	2026-07-11 16:49:47.018774	2026-07-11 16:49:47.018774
19	REQ-0003	jksnank	klqql	Technical Support	pending	medium	2	\N	2026-07-11 16:54:52.933597	2026-07-11 16:54:52.933597
21	REQ-0005	KLAJXlK	akl	Technical Support	pending	medium	4	\N	2026-07-11 17:26:15.324428	2026-07-11 17:26:15.324428
22	REQ-0006	iaK	POSk	Technical Support	completed	medium	2	\N	2026-07-11 17:54:08.630468	2026-07-11 18:08:36.055664
23	REQ-0007	pc not working	akjKJ	Technical Support	pending	high	13	\N	2026-07-13 09:51:06.506561	2026-07-13 09:51:06.506561
24	REQ-0008	printer not working	ajhjk	Technical Support	pending	medium	13	\N	2026-07-13 11:05:01.618638	2026-07-13 11:05:01.618638
25	REQ-0009	laptop missed	DNSJK	Software Installation	pending	high	13	\N	2026-07-13 11:14:55.225535	2026-07-13 11:14:55.225535
\.


--
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.resources_id_seq', 13, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- Name: work_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.work_requests_id_seq', 25, true);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: resources resources_resource_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_resource_code_key UNIQUE (resource_code);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: work_requests work_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_requests
    ADD CONSTRAINT work_requests_pkey PRIMARY KEY (id);


--
-- Name: work_requests work_requests_request_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_requests
    ADD CONSTRAINT work_requests_request_number_key UNIQUE (request_number);


--
-- Name: resources resources_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: work_requests work_requests_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_requests
    ADD CONSTRAINT work_requests_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: work_requests work_requests_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_requests
    ADD CONSTRAINT work_requests_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict cRrhxLNgjoU1uj3Zr8vS2klZanHopb3Tyb280Wdn7E7sWsJ5F8g8ZKHNU6gHWwu

