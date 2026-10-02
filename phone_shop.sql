--
-- PostgreSQL database dump
--

\restrict MfIjX7jBHf9vxtpCo6su8EiVlOf63r3KhV5B7ZeoxMC6lpiLlV7JZbcFRXAcChR

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6 (Debian 18.6-1.pgdg13+2)

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
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: orderitems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderitems (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer,
    quantity integer NOT NULL,
    price_at_that_time numeric(12,2) NOT NULL
);


ALTER TABLE public.orderitems OWNER TO postgres;

--
-- Name: orderitems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orderitems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orderitems_id_seq OWNER TO postgres;

--
-- Name: orderitems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orderitems_id_seq OWNED BY public.orderitems.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    shipping_address text,
    phone character varying(20),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    price numeric(12,2) NOT NULL,
    stock integer NOT NULL,
    description text,
    image_url character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    category_id integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'customer'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    email character varying(100) NOT NULL
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
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: orderitems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems ALTER COLUMN id SET DEFAULT nextval('public.orderitems_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name) FROM stdin;
4	oppo
7	apple
6	xiaomi
5	samsung
8	tecno
9	honor
10	nubia
11	sony
12	nokia
13	infinix
14	nothing-phone
15	masstel
16	realme
17	itel
18	huawei
19	meizu
20	vivo
21	oneplus
22	tcl
23	benco
24	asus
\.


--
-- Data for Name: orderitems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orderitems (id, order_id, product_id, quantity, price_at_that_time) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total_amount, status, shipping_address, phone, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, stock, description, image_url, "createdAt", "updatedAt", category_id) FROM stdin;
1	iPhone 18 Pro 256GB	38790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856274/phone_shop/products/ptto2wgxlciwc4un7h4c.webp	2026-10-01 19:04:35.474+07	2026-10-01 19:04:35.474+07	7
2	iPhone 17 Pro 256GB | Chính hãng	31990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856275/phone_shop/products/fo3s53skd3znjduy42al.webp	2026-10-01 19:04:37.206+07	2026-10-01 19:04:37.206+07	7
3	iPhone 18 Pro Max 256GB	41990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856277/phone_shop/products/nutlxhholuxuyufgq99b.webp	2026-10-01 19:04:38.743+07	2026-10-01 19:04:38.743+07	7
4	iPhone 17 Pro Max 256GB | Chính hãng	34790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856279/phone_shop/products/txogv7iilksb6lxc8fn4.webp	2026-10-01 19:04:40.178+07	2026-10-01 19:04:40.178+07	7
5	iPhone 17 256GB | Chính hãng	26990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856280/phone_shop/products/qhkv0tgc4b4bkklnoetg.webp	2026-10-01 19:04:41.552+07	2026-10-01 19:04:41.552+07	7
6	iPhone 18 Pro Max 2TB	80990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856281/phone_shop/products/tncubqacm7ibmip09vvr.webp	2026-10-01 19:04:42.976+07	2026-10-01 19:04:42.976+07	7
7	iPhone Air 256GB | Chính hãng	22990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856283/phone_shop/products/iuqdtbq2xzktbsq36qhc.webp	2026-10-01 19:04:44.318+07	2026-10-01 19:04:44.318+07	7
8	iPhone 17 Pro Max 512GB | Chính hãng	41390000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856284/phone_shop/products/wexw1pol0nskkksk0yoa.webp	2026-10-01 19:04:45.787+07	2026-10-01 19:04:45.787+07	7
9	iPhone 18 Pro 2TB	77490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856286/phone_shop/products/qdxh3in7f8qccvwzi9ve.webp	2026-10-01 19:04:47.11+07	2026-10-01 19:04:47.11+07	7
10	Điện thoại iPhone 16 Pro Max 256GB	30990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856287/phone_shop/products/e5qy3vimho2t35k0o0fv.webp	2026-10-01 19:04:48.716+07	2026-10-01 19:04:48.716+07	7
11	iPhone 15 128GB | Chính hãng VN/A	19990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856289/phone_shop/products/timi3scrs4hr39fsgg6n.webp	2026-10-01 19:04:50.12+07	2026-10-01 19:04:50.12+07	7
12	iPhone 17 Pro 512GB | Chính hãng	38490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856290/phone_shop/products/gljcxtbi2hkjwac01ke5.webp	2026-10-01 19:04:52.587+07	2026-10-01 19:04:52.587+07	7
13	iPhone 18 Pro Max 512GB	48490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856293/phone_shop/products/a4idvvcf6awnlua1qela.webp	2026-10-01 19:04:54.085+07	2026-10-01 19:04:54.085+07	7
14	iPhone 16e 128GB | Chính hãng VN/A	14290000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856294/phone_shop/products/qqr0bmoqnw0gvtadslcz.webp	2026-10-01 19:04:55.639+07	2026-10-01 19:04:55.639+07	7
15	iPhone 13 128GB | Chính hãng VN/A	14990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856296/phone_shop/products/b1pof1qfg0ur6zfeirez.webp	2026-10-01 19:04:57.084+07	2026-10-01 19:04:57.084+07	7
16	iPhone 16 128GB | Chính hãng VN/A	22990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856297/phone_shop/products/fsbt5kbrdq8upjte9wja.webp	2026-10-01 19:04:58.604+07	2026-10-01 19:04:58.604+07	7
17	iPhone 17e 256GB | Chính hãng	20990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856298/phone_shop/products/iiufpjbjpfamxvkipb6l.webp	2026-10-01 19:04:59.994+07	2026-10-01 19:04:59.994+07	7
18	iPhone 16 Pro Max 512GB | Chính hãng VN/A	38990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856300/phone_shop/products/j9reqztcczm063vyud5c.webp	2026-10-01 19:05:01.699+07	2026-10-01 19:05:01.699+07	7
19	iPhone 15 256GB | Chính hãng VN/A	24990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856302/phone_shop/products/cmmwqgxy9todqn3qrvhs.webp	2026-10-01 19:05:03.154+07	2026-10-01 19:05:03.154+07	7
20	iPhone 14 128GB  | Chính hãng VN/A	16990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856303/phone_shop/products/schyaavgrwjjyabqjxhx.webp	2026-10-01 19:05:04.628+07	2026-10-01 19:05:04.628+07	7
21	Samsung Galaxy S26 Ultra 5G 12GB 256GB	31990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856305/phone_shop/products/lcgqok34fg3qapdfp3iz.webp	2026-10-01 19:05:06.585+07	2026-10-01 19:05:06.585+07	5
22	Samsung Galaxy S26 FE 5G 8GB 128GB	16990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856307/phone_shop/products/hdmvzdbtfbm84rxr8iki.webp	2026-10-01 19:05:08.586+07	2026-10-01 19:05:08.586+07	5
23	Samsung Galaxy Z Fold8 Ultra 5G 12GB 256GB	48990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856308/phone_shop/products/og0kryhedronvoguay6p.webp	2026-10-01 19:05:10.235+07	2026-10-01 19:05:10.235+07	5
24	Samsung Galaxy A57 5G 8GB 128GB	11990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856310/phone_shop/products/vkdtjdqr4boyidue3c16.webp	2026-10-01 19:05:11.936+07	2026-10-01 19:05:11.936+07	5
25	Samsung Galaxy A37 5G 8GB 128GB	10490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856312/phone_shop/products/dsx1iux5rzxayt1f1rya.webp	2026-10-01 19:05:13.352+07	2026-10-01 19:05:13.352+07	5
26	Samsung Galaxy S25 Ultra 12GB 256GB	28490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856313/phone_shop/products/adwoldqty8puoe2uju3r.webp	2026-10-01 19:05:14.752+07	2026-10-01 19:05:14.752+07	5
27	Samsung Galaxy S25 FE 8GB 128GB	13690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856315/phone_shop/products/md8dyakeu29o7ar9i9i2.webp	2026-10-01 19:05:16.178+07	2026-10-01 19:05:16.178+07	5
28	Samsung Galaxy Z Fold8 5G 12GB 256GB	40990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856316/phone_shop/products/xjgzu1nslnqpnurtfttc.webp	2026-10-01 19:05:17.768+07	2026-10-01 19:05:17.768+07	5
29	Samsung Galaxy A17 5G 8GB 128GB	8490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856318/phone_shop/products/h5eimw6lfc6zepq5xlrx.webp	2026-10-01 19:05:19.684+07	2026-10-01 19:05:19.684+07	5
30	Samsung Galaxy Z Flip8 5G 12GB 256GB	27990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856320/phone_shop/products/ibrqfvdlijyxi37l1y0v.webp	2026-10-01 19:05:21.178+07	2026-10-01 19:05:21.178+07	5
31	Samsung Galaxy S26 5G 12GB 256GB	22990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856322/phone_shop/products/yxlx3sdvarkplqa0otez.webp	2026-10-01 19:05:23.684+07	2026-10-01 19:05:23.684+07	5
32	Samsung Galaxy A27 5G 6GB 128GB	8490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856323/phone_shop/products/wete74rjhs2gtlzeaacy.webp	2026-10-01 19:05:25.117+07	2026-10-01 19:05:25.117+07	5
33	Samsung Galaxy S25 Plus 256GB	20490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856325/phone_shop/products/rj3b3rkvvhzmkgrwjucu.webp	2026-10-01 19:05:26.477+07	2026-10-01 19:05:26.477+07	5
34	Samsung Galaxy A07 4GB 128GB	3990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856326/phone_shop/products/qyeabzcoarhtpfq9vlq8.webp	2026-10-01 19:05:27.887+07	2026-10-01 19:05:27.887+07	5
35	Samsung Galaxy A17 8GB 128GB	5990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856328/phone_shop/products/uohtofnesfbgmuh9zxea.webp	2026-10-01 19:05:29.288+07	2026-10-01 19:05:29.288+07	5
36	Samsung Galaxy A56 5G 8GB 128GB	9190000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856329/phone_shop/products/sno3wdg49gsmpib9u2ft.webp	2026-10-01 19:05:30.751+07	2026-10-01 19:05:30.751+07	5
37	Samsung Galaxy Z Fold8 Ultra 5G 12GB 512GB	54990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856331/phone_shop/products/vw6na6rhrniljs5ild4o.webp	2026-10-01 19:05:32.367+07	2026-10-01 19:05:32.367+07	5
38	Samsung Galaxy S24 Ultra 12GB 256GB	25290000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856332/phone_shop/products/xhvea6bho1cdflgi3uk4.webp	2026-10-01 19:05:33.936+07	2026-10-01 19:05:33.936+07	5
39	Samsung Galaxy A07 5G 4GB 128GB	5890000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856334/phone_shop/products/zffsrasb6bj4phfzqak6.webp	2026-10-01 19:05:35.6+07	2026-10-01 19:05:35.6+07	5
40	Samsung Galaxy Z Fold7 12GB 256GB	40990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856335/phone_shop/products/pwhjxaqikibye1kcncuu.webp	2026-10-01 19:05:37.412+07	2026-10-01 19:05:37.412+07	5
41	OPPO Reno16 F 5G 8GB 256GB	14990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856337/phone_shop/products/klylefw1bx5snp9gtxej.webp	2026-10-01 19:05:38.898+07	2026-10-01 19:05:38.898+07	4
42	OPPO Find X9s 12GB 256GB	24990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856339/phone_shop/products/coqzqtmfyxov7ujegabk.webp	2026-10-01 19:05:40.613+07	2026-10-01 19:05:40.613+07	4
43	OPPO Find N6 16GB 512GB	64990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856341/phone_shop/products/sivt0aez3ygfucjcjfoy.webp	2026-10-01 19:05:42.39+07	2026-10-01 19:05:42.39+07	4
44	OPPO Find X9 Ultra 12GB 512GB	45990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856342/phone_shop/products/x9hs3mzfyfs4vfvrnovz.webp	2026-10-01 19:05:44.178+07	2026-10-01 19:05:44.178+07	4
45	OPPO Reno15 5G 12GB 256GB	14990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856344/phone_shop/products/f0eneeuoj6vu8qtkizf2.webp	2026-10-01 19:05:45.814+07	2026-10-01 19:05:45.814+07	4
46	OPPO Reno15 F 5G 8GB 256GB	11990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856346/phone_shop/products/glpxspmiubuluj4xwnjz.webp	2026-10-01 19:05:47.446+07	2026-10-01 19:05:47.446+07	4
47	OPPO Reno12 5G 12GB 256GB	9690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856347/phone_shop/products/m79ckmsnnhfhfmf6mnjo.webp	2026-10-01 19:05:48.85+07	2026-10-01 19:05:48.85+07	4
48	OPPO Find X8 16GB 512GB	19490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856349/phone_shop/products/khum6efirakrdkvxg1up.webp	2026-10-01 19:05:50.423+07	2026-10-01 19:05:50.423+07	4
49	OPPO Reno10 Pro+ 5G 12GB 256GB	10490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856350/phone_shop/products/bevjgvjzzf3wpb0ade5u.webp	2026-10-01 19:05:51.856+07	2026-10-01 19:05:51.856+07	4
50	OPPO A6c 4GB 128GB	5690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856352/phone_shop/products/ak721ssexhwqtdsazqnz.webp	2026-10-01 19:05:53.565+07	2026-10-01 19:05:53.565+07	4
51	OPPO A6t 4GB 128GB	7090000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856353/phone_shop/products/yybryorfrgl23urkgjvn.webp	2026-10-01 19:05:55.012+07	2026-10-01 19:05:55.012+07	4
52	OPPO A6t Pro 8GB 128GB	10990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856355/phone_shop/products/kpla9eszjshbtxuhgwbe.webp	2026-10-01 19:05:56.384+07	2026-10-01 19:05:56.384+07	4
53	OPPO A6c 4GB 64GB	4690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856356/phone_shop/products/djql7aoumjdoeopawobs.webp	2026-10-01 19:05:57.769+07	2026-10-01 19:05:57.769+07	4
54	OPPO A6t 6GB 256GB	8790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856358/phone_shop/products/bs8rkwbdkcqs1flzcgbn.webp	2026-10-01 19:05:59.146+07	2026-10-01 19:05:59.146+07	4
55	OPPO Reno14 5G 12GB 256GB	15500000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856359/phone_shop/products/tzrits6tagaipwqzuilw.webp	2026-10-01 19:06:00.542+07	2026-10-01 19:06:00.542+07	4
56	OPPO A79 5G 8GB 256GB	7060000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856360/phone_shop/products/d5u2cdfbuy2lnwld2o8s.webp	2026-10-01 19:06:02.082+07	2026-10-01 19:06:02.082+07	4
57	OPPO Find X9 16GB 512GB	26990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856362/phone_shop/products/iyxfsjxmgbwdu1juvhca.webp	2026-10-01 19:06:03.514+07	2026-10-01 19:06:03.514+07	4
58	OPPO A6t 4GB 64GB	4990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856364/phone_shop/products/pmxbjtc5mpjkivo106li.webp	2026-10-01 19:06:05.167+07	2026-10-01 19:06:05.167+07	4
59	OPPO Find X5 Pro 5G 12GB 256GB	12990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856365/phone_shop/products/xogcdg6zyabnro0yxzfl.webp	2026-10-01 19:06:06.595+07	2026-10-01 19:06:06.595+07	4
60	OPPO Find N3 16GB 512GB	26990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856366/phone_shop/products/njyowo0ord54zqqfjm0b.webp	2026-10-01 19:06:07.94+07	2026-10-01 19:06:07.94+07	4
61	POCO X8 Pro Max 12GB 256GB	13790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856368/phone_shop/products/bmpy0tkxlwafpz7qrbra.webp	2026-10-01 19:06:09.413+07	2026-10-01 19:06:09.413+07	6
62	Xiaomi POCO F8 Pro 5G 12GB 256GB	15490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856369/phone_shop/products/krbqxxtubvpi0r34gg6z.jpg	2026-10-01 19:06:10.994+07	2026-10-01 19:06:10.994+07	6
63	Xiaomi Redmi Note 14 Pro Plus 5G 8GB 256GB	8190000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856371/phone_shop/products/sybudtpaiccg1vwxy9fu.webp	2026-10-01 19:06:12.31+07	2026-10-01 19:06:12.31+07	6
64	POCO X8 Pro Max 12GB 512GB	14590000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856372/phone_shop/products/u2uekwr6vwe0s48b7ifw.webp	2026-10-01 19:06:13.722+07	2026-10-01 19:06:13.722+07	6
65	Xiaomi POCO F9 Ultra 5G 12GB 256GB	23990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856374/phone_shop/products/mpbduf9wi9jhtxisvv7k.webp	2026-10-01 19:06:15.37+07	2026-10-01 19:06:15.37+07	6
66	POCO X8 Pro Max 12GB 256GB	13990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856375/phone_shop/products/ybfhzbaeshie0aikmd2l.webp	2026-10-01 19:06:16.736+07	2026-10-01 19:06:16.736+07	6
67	Xiaomi Redmi Note 17 4GB 128GB	6490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856377/phone_shop/products/zwa51u7lffm1hodz3bxy.webp	2026-10-01 19:06:18.266+07	2026-10-01 19:06:18.266+07	6
68	Xiaomi Redmi Note 17 Pro Max 5G 8GB 512GB	16490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856378/phone_shop/products/ntxvgw2xeb0unwmqqccq.webp	2026-10-01 19:06:19.692+07	2026-10-01 19:06:19.692+07	6
69	Xiaomi Redmi Note 17 5G 6GB 128GB	8490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856380/phone_shop/products/ugjvzobizsqulogmdewr.webp	2026-10-01 19:06:21.068+07	2026-10-01 19:06:21.068+07	6
70	Xiaomi Redmi Note 17 Pro 5G 6GB 256GB	10490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856381/phone_shop/products/danre4l0npejpf9upocx.webp	2026-10-01 19:06:22.429+07	2026-10-01 19:06:22.429+07	6
71	Xiaomi 17T 5G 12GB 512GB	18790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856382/phone_shop/products/wcavd22mcgr5gmgydi2n.webp	2026-10-01 19:06:23.888+07	2026-10-01 19:06:23.888+07	6
72	Xiaomi 17 Ultra 5G 16GB 512GB	31190000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856384/phone_shop/products/xwgeg4jd7lntccaz4kie.webp	2026-10-01 19:06:25.314+07	2026-10-01 19:06:25.314+07	6
73	Xiaomi 17T Pro 5G 12GB 512GB	22490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856385/phone_shop/products/nirtkvlorlgizsc2sfd1.webp	2026-10-01 19:06:26.772+07	2026-10-01 19:06:26.772+07	6
74	Xiaomi POCO F8 Pro 5G 12GB 256GB	15490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856387/phone_shop/products/wybffggqozkcj82y2a6d.webp	2026-10-01 19:06:28.181+07	2026-10-01 19:06:28.181+07	6
75	Xiaomi Redmi Note 15 6GB 128GB	5190000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856388/phone_shop/products/uyo0afdivdiuyrzzximz.webp	2026-10-01 19:06:29.639+07	2026-10-01 19:06:29.639+07	6
76	Xiaomi Redmi A7 3GB 64GB	3690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856389/phone_shop/products/ialz3lal83famydnortf.webp	2026-10-01 19:06:30.986+07	2026-10-01 19:06:30.986+07	6
77	Xiaomi Redmi Note 14 Pro Plus 5G 8GB 256GB	8490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856391/phone_shop/products/nmrh5aoscmcron7ewyxq.webp	2026-10-01 19:06:32.374+07	2026-10-01 19:06:32.374+07	6
78	Xiaomi Redmi Note 15 5G 6GB 128GB	5690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856392/phone_shop/products/q5zcz00fymrjdiqsfieq.webp	2026-10-01 19:06:34.004+07	2026-10-01 19:06:34.004+07	6
79	Xiaomi Redmi Note 15 Pro 12GB 256GB	7690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856394/phone_shop/products/hfjou9mraxulal8ftctj.webp	2026-10-01 19:06:35.785+07	2026-10-01 19:06:35.785+07	6
80	Xiaomi Redmi Note 15 Pro 5G 12GB 256GB	9990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856396/phone_shop/products/mz4omrdpzan55mvhksb9.webp	2026-10-01 19:06:37.552+07	2026-10-01 19:06:37.552+07	6
81	POCO X8 Pro Max 12GB 512GB	14790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856397/phone_shop/products/e7luislpbovmnpz2epbk.webp	2026-10-01 19:06:38.909+07	2026-10-01 19:06:38.909+07	6
82	Xiaomi 17 Ultra 5G 16GB 1TB	34990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856399/phone_shop/products/eqi2mv8oog8avvund9ss.webp	2026-10-01 19:06:40.373+07	2026-10-01 19:06:40.373+07	6
83	Xiaomi POCO F9 Ultra 5G 16GB 512GB	25990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856400/phone_shop/products/f8sjvmk1jwlb0bhmjtqe.webp	2026-10-01 19:06:41.701+07	2026-10-01 19:06:41.701+07	6
84	Xiaomi Redmi 15 5G 8GB 256GB	5990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856402/phone_shop/products/ro6aed9mkuev0jfjlbu3.webp	2026-10-01 19:06:43.218+07	2026-10-01 19:06:43.218+07	6
85	TECNO CAMON 40 8GB 128GB	5190000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856403/phone_shop/products/cqitjp2z2gxdq5rt4mfx.webp	2026-10-01 19:06:44.649+07	2026-10-01 19:06:44.649+07	8
86	Tecno Pova Curve 2 5G 8GB 128GB	8390000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856404/phone_shop/products/udnt9diw1ykpyup84qbw.webp	2026-10-01 19:06:46.147+07	2026-10-01 19:06:46.147+07	8
87	TECNO Spark 40 Pro+ 8GB 256GB	5190000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856406/phone_shop/products/tgjpirvzyqyod7fhddxq.webp	2026-10-01 19:06:47.657+07	2026-10-01 19:06:47.657+07	8
88	TECNO Spark 50 4GB 128GB	4790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856407/phone_shop/products/tguxaxvcwvqxbcekbicn.webp	2026-10-01 19:06:49.02+07	2026-10-01 19:06:49.02+07	8
89	TECNO CAMON 40 Pro 8GB 256GB	5790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856409/phone_shop/products/nx84hsb4i4xqvbm7znua.webp	2026-10-01 19:06:50.348+07	2026-10-01 19:06:50.348+07	8
90	TECNO Spark Go 3 4GB 64GB	3490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856410/phone_shop/products/stufiwidtyqe0g4ix1ek.webp	2026-10-01 19:06:51.777+07	2026-10-01 19:06:51.777+07	8
91	TECNO CAMON 40 8GB 256GB	5390000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856412/phone_shop/products/uvjd8dycpxvnsfksrsvm.webp	2026-10-01 19:06:53.145+07	2026-10-01 19:06:53.145+07	8
92	Tecno Pova Curve 2 5G 8GB 256GB	9390000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856413/phone_shop/products/hev8uhyzp9k0xwqm6d1s.webp	2026-10-01 19:06:55.132+07	2026-10-01 19:06:55.132+07	8
93	TECNO Pova 8 8GB 128GB	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856415/phone_shop/products/van7cg3hslmayxkiwsjg.webp	2026-10-01 19:06:56.531+07	2026-10-01 19:06:56.531+07	8
94	TECNO Spark 50 Pro 4GB 128GB	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856416/phone_shop/products/c1pqbj7l08iuwge1mekd.webp	2026-10-01 19:06:57.968+07	2026-10-01 19:06:57.968+07	8
95	Tecno Phantom V Fold	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856418/phone_shop/products/rvioxlaevljk2t5husgv.webp	2026-10-01 19:06:59.399+07	2026-10-01 19:06:59.399+07	8
96	Tecno Spark 10C	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856419/phone_shop/products/heqt2eblseqjnrbltjcz.webp	2026-10-01 19:07:00.766+07	2026-10-01 19:07:00.766+07	8
97	TECNO Pova 8 8GB 256GB	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856421/phone_shop/products/hf2fh4jgsasxcudh0cqi.webp	2026-10-01 19:07:02.379+07	2026-10-01 19:07:02.379+07	8
98	TECNO CAMON 20 Pro 5G	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856422/phone_shop/products/ctok210dtzarlsuy5rbc.webp	2026-10-01 19:07:03.901+07	2026-10-01 19:07:03.901+07	8
99	Tecno Camon 19	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856424/phone_shop/products/ttpi8pxppkzegc8xyk7c.webp	2026-10-01 19:07:05.786+07	2026-10-01 19:07:05.786+07	8
100	TECNO CAMON 20 Premier	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856426/phone_shop/products/feijq0li43pq1lyowywp.webp	2026-10-01 19:07:07.349+07	2026-10-01 19:07:07.349+07	8
101	Tecno Pova Neo 5G	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856428/phone_shop/products/try3nv1q42vtrhbako3n.webp	2026-10-01 19:07:10.602+07	2026-10-01 19:07:10.602+07	8
102	TECNO POP 20C	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856430/phone_shop/products/xiocihogbrtx0hkimnh4.webp	2026-10-01 19:07:12.334+07	2026-10-01 19:07:12.334+07	8
103	TECNO Spark 50S 5G	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856432/phone_shop/products/lhcexzkjsbx4zkhguilg.webp	2026-10-01 19:07:13.747+07	2026-10-01 19:07:13.747+07	8
104	Tecno Spark 9	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856434/phone_shop/products/w6ydwo5tglaczvhc2nbg.webp	2026-10-01 19:07:15.582+07	2026-10-01 19:07:15.582+07	8
105	HONOR 600 5G 8GB 256GB	16090000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856435/phone_shop/products/tctugktxlk446gv9h8pb.webp	2026-10-01 19:07:17.256+07	2026-10-01 19:07:17.256+07	9
106	HONOR X9d 5G 8GB 256GB	11990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856437/phone_shop/products/uooqyquwypv6anjho3ny.webp	2026-10-01 19:07:18.65+07	2026-10-01 19:07:18.65+07	9
107	HONOR X9d 5G 12GB 256GB	12990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856439/phone_shop/products/pnai8vps54pmnwyidjcs.webp	2026-10-01 19:07:20.085+07	2026-10-01 19:07:20.085+07	9
108	HONOR 400 5G 12GB 256GB	12750000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856440/phone_shop/products/y27cdii9jxsve4h868ce.webp	2026-10-01 19:07:21.508+07	2026-10-01 19:07:21.508+07	9
109	HONOR X7d 8GB 128GB	6490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856441/phone_shop/products/cnacluopn8sv4x4ggr2x.webp	2026-10-01 19:07:22.921+07	2026-10-01 19:07:22.921+07	9
110	HONOR 400 Pro 5G 12GB 512GB	14990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856443/phone_shop/products/vndhuveuh3zn8qiowka0.webp	2026-10-01 19:07:24.386+07	2026-10-01 19:07:24.386+07	9
111	HONOR X8d 8GB 128GB	7590000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856444/phone_shop/products/p29vz28wm9vtisz7kdd5.webp	2026-10-01 19:07:25.892+07	2026-10-01 19:07:25.892+07	9
112	HONOR X7d 8GB 256GB	6690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856446/phone_shop/products/f6509ytth9uzubiefr0t.webp	2026-10-01 19:07:28.086+07	2026-10-01 19:07:28.086+07	9
113	HONOR Magic V5 16GB 512GB	35490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856448/phone_shop/products/xkwcumbdiu6jssxdkfc8.webp	2026-10-01 19:07:29.435+07	2026-10-01 19:07:29.435+07	9
114	HONOR X9d 5G 12GB 512GB	13490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856449/phone_shop/products/dpnvz0yshf7bk4prqqqo.webp	2026-10-01 19:07:31.409+07	2026-10-01 19:07:31.409+07	9
115	HONOR X7d 5G 8GB 256GB	7490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856451/phone_shop/products/l2ahidpkebtwx0lezr48.webp	2026-10-01 19:07:32.786+07	2026-10-01 19:07:32.786+07	9
116	HONOR X6c 6GB 128GB NFC	4490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856453/phone_shop/products/bbsilitv5euqnlwambnf.webp	2026-10-01 19:07:34.77+07	2026-10-01 19:07:34.77+07	9
117	HONOR 400 5G 12GB 512GB	12990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856455/phone_shop/products/xbbwtluz4ew0caoxpw4r.webp	2026-10-01 19:07:36.12+07	2026-10-01 19:07:36.12+07	9
118	HONOR 600 5G 8GB 256GB	16090000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856456/phone_shop/products/pkk6jbimw2qnz5tztvbx.webp	2026-10-01 19:07:37.609+07	2026-10-01 19:07:37.609+07	9
119	HONOR X9d 5G 8GB 256GB	11990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856457/phone_shop/products/bvd4mh54ayadnr1pftjt.webp	2026-10-01 19:07:39.085+07	2026-10-01 19:07:39.085+07	9
120	HONOR X9d 5G 12GB 256GB	12990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856459/phone_shop/products/tgjhux8iblqlskzx3b4b.webp	2026-10-01 19:07:40.524+07	2026-10-01 19:07:40.524+07	9
121	HONOR 400 5G 12GB 256GB	12750000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856460/phone_shop/products/mkg54lnesgk3xsqtsyoa.webp	2026-10-01 19:07:43.063+07	2026-10-01 19:07:43.063+07	9
122	HONOR X7d 8GB 128GB	6490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856463/phone_shop/products/ibrxiherszyzcpobpgxa.webp	2026-10-01 19:07:44.605+07	2026-10-01 19:07:44.605+07	9
123	HONOR 400 Pro 5G 12GB 512GB	14990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856464/phone_shop/products/g0gh71skfsamk6sqs7f1.webp	2026-10-01 19:07:46.358+07	2026-10-01 19:07:46.358+07	9
124	HONOR X8d 8GB 128GB	7590000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856466/phone_shop/products/ue5fss1chbeqveorfr0i.webp	2026-10-01 19:07:47.703+07	2026-10-01 19:07:47.703+07	9
125	HONOR X7d 8GB 256GB	6690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856468/phone_shop/products/w1sjbqstoo4z0xilnz1t.webp	2026-10-01 19:07:49.127+07	2026-10-01 19:07:49.127+07	9
126	HONOR Magic V5 16GB 512GB	35490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856469/phone_shop/products/zzigo5vbfa5ms6d3kkzh.webp	2026-10-01 19:07:50.676+07	2026-10-01 19:07:50.676+07	9
127	HONOR X9d 5G 12GB 512GB	13490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856471/phone_shop/products/i3ybzbzrvfwhh6ocloky.webp	2026-10-01 19:07:52.194+07	2026-10-01 19:07:52.194+07	9
128	HONOR Win RT	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856472/phone_shop/products/sdpcc43htjyxerbnma7x.webp	2026-10-01 19:07:53.5+07	2026-10-01 19:07:53.5+07	9
129	HONOR X7d 5G 8GB 256GB	7490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856473/phone_shop/products/kskadibhnieyfxlthhp7.webp	2026-10-01 19:07:54.868+07	2026-10-01 19:07:54.868+07	9
130	HONOR X6c 6GB 128GB NFC	4490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856475/phone_shop/products/egid4jxsw1awf3gulwai.webp	2026-10-01 19:07:56.258+07	2026-10-01 19:07:56.258+07	9
131	HONOR 400 5G 12GB 512GB	12990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856476/phone_shop/products/hwxpfdfkq0zjkat7siyo.webp	2026-10-01 19:07:58.115+07	2026-10-01 19:07:58.115+07	9
132	HONOR Power 2	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856478/phone_shop/products/q23eaib9u5vxefsyzjhi.webp	2026-10-01 19:07:59.65+07	2026-10-01 19:07:59.65+07	9
133	Honor X5c Plus 4GB 64GB	3690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856479/phone_shop/products/xpsrbqkwiiw9ylximg7p.webp	2026-10-01 19:08:01.079+07	2026-10-01 19:08:01.079+07	9
134	HONOR Play 10 4GB 128GB	3690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856481/phone_shop/products/eihbcv447wf7eexpjpp7.webp	2026-10-01 19:08:02.568+07	2026-10-01 19:08:02.568+07	9
135	Honor X5c Plus 4GB 128GB	3990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856482/phone_shop/products/gb6hdubrth2vydlnpij7.webp	2026-10-01 19:08:03.955+07	2026-10-01 19:08:03.955+07	9
136	Honor Magic 5 Pro	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856484/phone_shop/products/dkymxq21lgq09mjb5zx9.webp	2026-10-01 19:08:05.414+07	2026-10-01 19:08:05.414+07	9
137	Honor Magic 6 Pro	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856485/phone_shop/products/ycsxjbleavts3cvaig5a.webp	2026-10-01 19:08:07.077+07	2026-10-01 19:08:07.077+07	9
138	Nubia Neo 5 5G 8GB 128GB	6190000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856487/phone_shop/products/qismv05fzgxlw9ulwb7o.webp	2026-10-01 19:08:08.917+07	2026-10-01 19:08:08.917+07	10
139	Nubia Neo 5 5G 8GB 256GB	7190000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856489/phone_shop/products/xxb8t0eq2h1wiqq2v4ve.webp	2026-10-01 19:08:10.404+07	2026-10-01 19:08:10.404+07	10
140	Nubia Neo 5 GT 8GB 256GB	8990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856490/phone_shop/products/rs63tky0tch7e4qi3eoq.webp	2026-10-01 19:08:12.124+07	2026-10-01 19:08:12.124+07	10
141	Nubia Neo 5 GT Special Edition 12GB 256GB	13990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856492/phone_shop/products/mliiwnrwhk1ni38gfzas.webp	2026-10-01 19:08:13.516+07	2026-10-01 19:08:13.516+07	10
142	Nubia Neo 5 Max 5G 8GB 256GB	8790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856493/phone_shop/products/mnwtosdlk8zowmbiu7dc.webp	2026-10-01 19:08:14.914+07	2026-10-01 19:08:14.914+07	10
143	Nubia V80 Design 8GB 128GB	3990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856495/phone_shop/products/qsn42ihwfdzm1fwfzflt.webp	2026-10-01 19:08:16.317+07	2026-10-01 19:08:16.317+07	10
144	Nubia Neo 3 GT 12GB 256GB	7490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856496/phone_shop/products/hewczhrqiev94lfjfb92.webp	2026-10-01 19:08:17.846+07	2026-10-01 19:08:17.846+07	10
145	Nubia V80 Max 8GB 256GB	4690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856498/phone_shop/products/surf5fwryg6vweg6gfov.webp	2026-10-01 19:08:19.277+07	2026-10-01 19:08:19.277+07	10
146	Nubia Neo 5 GT 12GB 256GB	9990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856499/phone_shop/products/tpr3qolu3mpglb2yryzw.webp	2026-10-01 19:08:20.631+07	2026-10-01 19:08:20.631+07	10
147	ZTE Nubia Z60S Pro 16GB 512GB	11490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856500/phone_shop/products/fvdjfzkmiplaqoflrfim.webp	2026-10-01 19:08:22.143+07	2026-10-01 19:08:22.143+07	10
148	Nubia V80 Max 6GB 128GB	3890000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856502/phone_shop/products/yn3f7hpoaotg35keycqu.webp	2026-10-01 19:08:23.608+07	2026-10-01 19:08:23.608+07	10
149	Nubia Neo 3 4G 8GB 128GB	5290000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856503/phone_shop/products/ozv5ted0fegasyqo3ntg.webp	2026-10-01 19:08:25.008+07	2026-10-01 19:08:25.008+07	10
150	Nubia V80 Design 4GB 128GB	3690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856505/phone_shop/products/p3ipfvptlulmokp32vym.webp	2026-10-01 19:08:26.411+07	2026-10-01 19:08:26.411+07	10
151	Nubia Neo 3 5G 8GB 256GB	5090000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856506/phone_shop/products/lipxfpqfffjdvqqvpxiz.webp	2026-10-01 19:08:27.857+07	2026-10-01 19:08:27.857+07	10
152	Nubia Air 5G 8GB 256GB	5490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856508/phone_shop/products/tf1yhk0ldus9ukkfi9bg.webp	2026-10-01 19:08:29.69+07	2026-10-01 19:08:29.69+07	10
153	Nubia Neo 5 Max 5G 8GB 512GB	9790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856510/phone_shop/products/uidz3ienpeaoxwrfa13a.webp	2026-10-01 19:08:31.189+07	2026-10-01 19:08:31.189+07	10
154	Nubia V70 Max 6GB 128GB	2590000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856511/phone_shop/products/vyapopvzj2ctx880bfdb.webp	2026-10-01 19:08:33.003+07	2026-10-01 19:08:33.003+07	10
155	Nubia V80 Max 8GB 128GB	4990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856513/phone_shop/products/s6kjfbdctbikmqsa3dqv.webp	2026-10-01 19:08:34.569+07	2026-10-01 19:08:34.569+07	10
156	Nubia Red Magic 9 Pro	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856514/phone_shop/products/moj3xjswhj9zzyqu1o2l.webp	2026-10-01 19:08:35.929+07	2026-10-01 19:08:35.929+07	10
157	Red Magic 7S Pro	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856516/phone_shop/products/iqg5gunuoxf5w2wsctaf.webp	2026-10-01 19:08:37.31+07	2026-10-01 19:08:37.31+07	10
158	Sony Xperia 1 VIII 5G 12GB 256GB	37990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856517/phone_shop/products/qjv3ppezdo2pjithveyj.webp	2026-10-01 19:08:38.953+07	2026-10-01 19:08:38.953+07	11
159	Sony Xperia 1 VII 12GB 256GB	23990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856519/phone_shop/products/kunr4zeafetsiqhzatjw.webp	2026-10-01 19:08:40.284+07	2026-10-01 19:08:40.284+07	11
160	Sony Xperia 10 VII 8GB 128GB	9990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856520/phone_shop/products/thde96si6xlpaygrdkun.webp	2026-10-01 19:08:41.929+07	2026-10-01 19:08:41.929+07	11
161	Sony Xperia 10 VIII	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856522/phone_shop/products/ugfocrpjjv1breeps1kv.webp	2026-10-01 19:08:43.43+07	2026-10-01 19:08:43.43+07	11
162	Xperia 10 V	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856523/phone_shop/products/mwpkvjgtxtdmfbceucsn.webp	2026-10-01 19:08:44.979+07	2026-10-01 19:08:44.979+07	11
163	Xperia 5 V	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856525/phone_shop/products/kzphrgnpmxey0rdvxllh.webp	2026-10-01 19:08:46.434+07	2026-10-01 19:08:46.434+07	11
164	Sony Xperia 5 IV	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856526/phone_shop/products/gs3xqdpgzddo6dhyvc67.webp	2026-10-01 19:08:47.776+07	2026-10-01 19:08:47.776+07	11
165	Sony Xperia X Compact	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856528/phone_shop/products/oedhw1qowojfvmhmfjrt.webp	2026-10-01 19:08:50.132+07	2026-10-01 19:08:50.132+07	11
166	Nokia 220 4G	980000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856530/phone_shop/products/f7bfbvfbibp177h19zbj.webp	2026-10-01 19:08:51.864+07	2026-10-01 19:08:51.864+07	12
167	Nokia HMD 105 4G	750000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856532/phone_shop/products/pfgdumzfw3afrnpfcelh.webp	2026-10-01 19:08:53.208+07	2026-10-01 19:08:53.208+07	12
168	Nokia 3210 4G	1470000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856533/phone_shop/products/xnxh8v0bltei7v6s1c8q.webp	2026-10-01 19:08:54.557+07	2026-10-01 19:08:54.557+07	12
169	Nokia 105 4G Pro	780000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856534/phone_shop/products/wud3z4n8gwcvexqxlrvc.webp	2026-10-01 19:08:56.056+07	2026-10-01 19:08:56.056+07	12
170	Nokia 110 4G Pro	850000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856536/phone_shop/products/mzb833cq15ivefk0zkf9.webp	2026-10-01 19:08:57.543+07	2026-10-01 19:08:57.543+07	12
171	Nokia 150	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856537/phone_shop/products/umtqhblnfgrkfpeinsay.webp	2026-10-01 19:08:59.144+07	2026-10-01 19:08:59.144+07	12
172	Nokia 130	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856539/phone_shop/products/el9ncfo61vg7mmcdhto3.webp	2026-10-01 19:09:00.506+07	2026-10-01 19:09:00.506+07	12
173	Nokia 7.2	6190000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856540/phone_shop/products/xnwy4um7zowp0mpp9zuu.webp	2026-10-01 19:09:02.12+07	2026-10-01 19:09:02.12+07	12
174	Nokia 3.2	3290000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856542/phone_shop/products/rat3pb0mwttthdckqowo.webp	2026-10-01 19:09:03.461+07	2026-10-01 19:09:03.461+07	12
175	Infinix HOT 50i 4GB 128GB	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856543/phone_shop/products/yvmwqgn8eymc1puhkcch.webp	2026-10-01 19:09:04.909+07	2026-10-01 19:09:04.909+07	13
176	Infinix Note 30 Pro	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856545/phone_shop/products/a1gaehlfuzp6yiabttzw.webp	2026-10-01 19:09:06.612+07	2026-10-01 19:09:06.612+07	13
177	Infinix Hot 50 Pro 8GB 256GB	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856547/phone_shop/products/trg77ksktrzburc2013i.webp	2026-10-01 19:09:08.46+07	2026-10-01 19:09:08.46+07	13
178	Infinix Smart 9 3GB 64GB	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856548/phone_shop/products/zwfk9mpg72sv6m0l0kgg.webp	2026-10-01 19:09:09.847+07	2026-10-01 19:09:09.847+07	13
179	Nothing Phone 2A Plus 5G 12GB 256GB	7990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856550/phone_shop/products/fx63yfgytmkdbk9yly8p.webp	2026-10-01 19:09:11.292+07	2026-10-01 19:09:11.292+07	14
180	Nothing Phone 3A 8GB 128GB	8790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856552/phone_shop/products/gjtzd7o3byiw0axr69if.webp	2026-10-01 19:09:13.131+07	2026-10-01 19:09:13.131+07	14
181	Nothing Phone 2A 5G 8GB 128GB	7190000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856553/phone_shop/products/afv4gpwi0yt2x30n8qvw.webp	2026-10-01 19:09:14.714+07	2026-10-01 19:09:14.714+07	14
182	Nothing Phone 2A 5G 12GB 256GB	8490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856555/phone_shop/products/mhqnf7iuh0elzwsveyda.webp	2026-10-01 19:09:16.028+07	2026-10-01 19:09:16.028+07	14
183	Nothing Phone 2	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856556/phone_shop/products/bs3kk5g9slfjxrqp2tvz.webp	2026-10-01 19:09:17.451+07	2026-10-01 19:09:17.451+07	14
184	Nothing Phone 3A 12GB 256GB	9990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856557/phone_shop/products/noucdd04nzawc6man57a.webp	2026-10-01 19:09:18.905+07	2026-10-01 19:09:18.905+07	14
185	Nothing Phone 3A Pro	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856559/phone_shop/products/jydh9cquoh4isg8gmee4.webp	2026-10-01 19:09:20.358+07	2026-10-01 19:09:20.358+07	14
186	Nothing Phone 1	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856560/phone_shop/products/tlqupczmlxutsr1kp4jv.webp	2026-10-01 19:09:21.8+07	2026-10-01 19:09:21.8+07	14
187	Điện thoại trẻ em Masstel Alfa 5	1050000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856562/phone_shop/products/ggefgn3t2k5jgvrvexrm.webp	2026-10-01 19:09:23.396+07	2026-10-01 19:09:23.396+07	15
188	Masstel Izi 15 4G	420000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856563/phone_shop/products/vdh2lwizlaig4x724pnc.webp	2026-10-01 19:09:24.852+07	2026-10-01 19:09:24.852+07	15
189	Masstel izi T8	530000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856565/phone_shop/products/saa6ze2sxiqdu9lluwcs.webp	2026-10-01 19:09:26.302+07	2026-10-01 19:09:26.302+07	15
190	Masstel Fami 8 4G	580000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856566/phone_shop/products/gkkr7hcrlr7u6xsuvohp.webp	2026-10-01 19:09:27.655+07	2026-10-01 19:09:27.655+07	15
191	Masstel izi T5 plus 4G	530000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856568/phone_shop/products/nx1qaijf6kd6m2rslued.webp	2026-10-01 19:09:29.452+07	2026-10-01 19:09:29.452+07	15
192	Masstel izi S5 4G	440000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856569/phone_shop/products/t09wdw0krhwub3ibhtn6.webp	2026-10-01 19:09:30.956+07	2026-10-01 19:09:30.956+07	15
193	Masstel Izi S8	485000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856571/phone_shop/products/ejqo3pqmzc8fobpyrqhy.webp	2026-10-01 19:09:32.354+07	2026-10-01 19:09:32.354+07	15
194	Masstel Fami 25	650000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856572/phone_shop/products/n4c4wontulrhxt9vdgwh.webp	2026-10-01 19:09:33.696+07	2026-10-01 19:09:33.696+07	15
195	Masstel izi  22	470000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856574/phone_shop/products/eoy2taelos59u73lipcd.webp	2026-10-01 19:09:35.592+07	2026-10-01 19:09:35.592+07	15
196	Masstel Izi 10 4G	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856575/phone_shop/products/z731yjbfjxe6wocuxcrl.webp	2026-10-01 19:09:37.023+07	2026-10-01 19:09:37.023+07	15
197	masstel fami 60	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856577/phone_shop/products/keee6s0kr0nzu056jfnp.webp	2026-10-01 19:09:38.46+07	2026-10-01 19:09:38.46+07	15
198	realme 13+ 5G 8GB 256GB	6590000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856578/phone_shop/products/ek8csbvjsc6ygub1zgrl.webp	2026-10-01 19:09:39.864+07	2026-10-01 19:09:39.864+07	16
199	realme GT Neo 5	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856580/phone_shop/products/sfq0tnicxoillswmwaov.webp	2026-10-01 19:09:41.638+07	2026-10-01 19:09:41.638+07	16
200	Realme GT3	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856581/phone_shop/products/bvs7nhkjwkgg8pk3xaqx.webp	2026-10-01 19:09:43.276+07	2026-10-01 19:09:43.276+07	16
201	realme 10 Pro Plus	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856583/phone_shop/products/pvmv4upmk7ntqz0wa8yn.webp	2026-10-01 19:09:44.807+07	2026-10-01 19:09:44.807+07	16
202	realme Narzo 50	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856585/phone_shop/products/dxpodaj4xfvkc5j4pmeh.webp	2026-10-01 19:09:46.343+07	2026-10-01 19:09:46.343+07	16
203	realme 13+ 5G 12GB 256GB	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856586/phone_shop/products/byvs92idwdmhr3vwgyuh.webp	2026-10-01 19:09:47.794+07	2026-10-01 19:09:47.794+07	16
204	Realme 9 SE 5G	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856588/phone_shop/products/imyh0o1oxfpuexhoqbsw.webp	2026-10-01 19:09:49.187+07	2026-10-01 19:09:49.187+07	16
205	realme C67 8GB 256GB	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856589/phone_shop/products/yen0ozm59bjqefskyqjx.webp	2026-10-01 19:09:50.597+07	2026-10-01 19:09:50.597+07	16
206	Điện thoại Itel P55 Plus NFC 8GB 256GB	3590000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856590/phone_shop/products/wlmlarexlxemmtzo2mws.webp	2026-10-01 19:09:52.035+07	2026-10-01 19:09:52.035+07	17
207	Huawei Mate X7 16GB 512GB	42990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856592/phone_shop/products/hsrcbhhcbor5rk9bxccw.webp	2026-10-01 19:09:53.507+07	2026-10-01 19:09:53.507+07	18
208	Huawei P60 Pro	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856593/phone_shop/products/hmnlhcdskmvunooogijh.webp	2026-10-01 19:09:54.916+07	2026-10-01 19:09:54.916+07	18
209	Huawei Nova 10 SE	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856595/phone_shop/products/uuiemwbzdhjat6qjgt9i.webp	2026-10-01 19:09:56.636+07	2026-10-01 19:09:56.636+07	18
210	Huawei Nova 10	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856596/phone_shop/products/yae7ltdqtmeplxzru5h5.webp	2026-10-01 19:09:57.968+07	2026-10-01 19:09:57.968+07	18
211	Huawei Pocket S	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856598/phone_shop/products/zs63ulcehkseps0gml79.webp	2026-10-01 19:09:59.385+07	2026-10-01 19:09:59.385+07	18
212	Huawei Nova 10 Pro	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856599/phone_shop/products/bubudvi3fmpwwmzyio3n.webp	2026-10-01 19:10:00.769+07	2026-10-01 19:10:00.769+07	18
213	Huawei Nova 9 SE	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856601/phone_shop/products/cgebdmtozgjgmyxmb0qx.webp	2026-10-01 19:10:02.197+07	2026-10-01 19:10:02.197+07	18
214	Huawei Nova 10z	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856602/phone_shop/products/b0wz7wau1dmaxf4sfu2x.webp	2026-10-01 19:10:03.591+07	2026-10-01 19:10:03.591+07	18
215	Huawei Nova 9 SE	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856603/phone_shop/products/smxaasolczhruyqk1vvw.webp	2026-10-01 19:10:05.188+07	2026-10-01 19:10:05.188+07	18
216	Huawei Nova 7 SE	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856605/phone_shop/products/vj9vxt8ktxmuxf1fnviu.webp	2026-10-01 19:10:06.808+07	2026-10-01 19:10:06.808+07	18
217	Huawei P30 Lite	7490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856607/phone_shop/products/nt7w6n64rnfmy9pa6k2p.webp	2026-10-01 19:10:08.225+07	2026-10-01 19:10:08.225+07	18
218	Huawei P30 Pro	23990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856608/phone_shop/products/sgbdrgztpt9zrbqxdcym.webp	2026-10-01 19:10:10.312+07	2026-10-01 19:10:10.312+07	18
219	Huawei P30	17990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856610/phone_shop/products/hveqkonbcud6sfptxrfa.webp	2026-10-01 19:10:11.831+07	2026-10-01 19:10:11.831+07	18
220	Điện thoại Meizu Mblu Note 21 Pro NFC 8GB 256GB	4790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856612/phone_shop/products/kaaymh3gg7c084ypfnlw.webp	2026-10-01 19:10:13.27+07	2026-10-01 19:10:13.27+07	19
221	Meizu Lucky 08 5G 12GB 256GB	6290000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856614/phone_shop/products/wsbbezctqhjosxmwgovn.png	2026-10-01 19:10:15.227+07	2026-10-01 19:10:15.227+07	19
222	Điện thoại Meizu Mblu 22 Pro NFC 4GB 128GB	3490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856615/phone_shop/products/mycb4zilksqzvvgfj8g5.webp	2026-10-01 19:10:16.619+07	2026-10-01 19:10:16.619+07	19
223	Điện thoại Meizu Mblu 22 4GB 128GB	2990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856616/phone_shop/products/t2u8nz9bbucwbrksxhfi.webp	2026-10-01 19:10:18.108+07	2026-10-01 19:10:18.108+07	19
224	Meizu Lucky 08 5G 8GB 256GB	5790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856618/phone_shop/products/rc3hb3ka0i6uaszjcqfx.webp	2026-10-01 19:10:19.622+07	2026-10-01 19:10:19.622+07	19
225	Điện thoại Meizu Mblu 21 6GB 128GB	2790000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856620/phone_shop/products/nfmheob5nmqjpsh6pe8k.webp	2026-10-01 19:10:21.077+07	2026-10-01 19:10:21.077+07	19
226	Điện thoại Meizu Mblu 22 Pro NFC 6GB 256GB	3690000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856621/phone_shop/products/i7chewfarug0qt31ilgj.webp	2026-10-01 19:10:22.532+07	2026-10-01 19:10:22.532+07	19
227	Điện thoại Meizu Mblu 22 3GB 64GB	2990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856622/phone_shop/products/dqtkissrtz81t6mllxke.webp	2026-10-01 19:10:23.862+07	2026-10-01 19:10:23.862+07	19
228	Điện thoại Meizu Mblu 22 Pro NFC 8GB 256GB	4090000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856624/phone_shop/products/ynh3wai1xtxwejydsy9f.webp	2026-10-01 19:10:25.261+07	2026-10-01 19:10:25.261+07	19
229	Điện thoại Meizu Mblu 21 4GB 64GB	2290000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856625/phone_shop/products/v6j8umacrh07nucui3de.webp	2026-10-01 19:10:26.894+07	2026-10-01 19:10:26.894+07	19
230	Điện thoại Meizu Mblu 22 4GB 128GB - Đã kích hoạt	2190000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856627/phone_shop/products/fwfhapken9bejnt5c8eu.webp	2026-10-01 19:10:28.558+07	2026-10-01 19:10:28.558+07	19
231	vivo Y28 8GB 256GB	6490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856628/phone_shop/products/igm1h2eznghhdjk7pbub.webp	2026-10-01 19:10:29.918+07	2026-10-01 19:10:29.918+07	20
232	vivo Y16 4GB 128GB	4490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856630/phone_shop/products/gozzntvxvjftspxx5eua.webp	2026-10-01 19:10:31.279+07	2026-10-01 19:10:31.279+07	20
233	vivo Y36 8GB 256GB	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856631/phone_shop/products/zyzlszm05e9jvwmdzyka.webp	2026-10-01 19:10:32.66+07	2026-10-01 19:10:32.66+07	20
234	vivo V40 Lite	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856633/phone_shop/products/j7qizny2h30hsryrmqmn.webp	2026-10-01 19:10:34.371+07	2026-10-01 19:10:34.371+07	20
235	Vivo Y52t	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856634/phone_shop/products/f59qnjvgsid6p2r7wlts.webp	2026-10-01 19:10:35.765+07	2026-10-01 19:10:35.765+07	20
236	OnePlus Nord N30	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856636/phone_shop/products/q69aii5vc26v1nlmqf9z.webp	2026-10-01 19:10:37.337+07	2026-10-01 19:10:37.337+07	21
237	Oneplus Ace 2 Pro	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856637/phone_shop/products/ajf275pwgcwud4pc4ebt.webp	2026-10-01 19:10:38.932+07	2026-10-01 19:10:38.932+07	21
238	OnePlus Ace 2V	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856639/phone_shop/products/slouax0zyclxsikjjwne.webp	2026-10-01 19:10:41.048+07	2026-10-01 19:10:41.048+07	21
239	Oneplus Nord N300	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856641/phone_shop/products/ehwgfoy0mewu5to0i4sq.webp	2026-10-01 19:10:42.559+07	2026-10-01 19:10:42.559+07	21
240	Oneplus Open	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856642/phone_shop/products/qoaiv0aqvdpzhoiujmfw.webp	2026-10-01 19:10:44.084+07	2026-10-01 19:10:44.084+07	21
241	OnePlus Ace 3 Pro	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856644/phone_shop/products/krm8nmdillq9ixjxu28j.webp	2026-10-01 19:10:45.76+07	2026-10-01 19:10:45.76+07	21
242	OnePlus V Fold	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856646/phone_shop/products/w3pbpxrwyweyakxx8bdn.webp	2026-10-01 19:10:47.465+07	2026-10-01 19:10:47.465+07	21
243	OnePlus Nord N20 SE	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856647/phone_shop/products/uthvd2wrro6obifcoc1o.webp	2026-10-01 19:10:48.871+07	2026-10-01 19:10:48.871+07	21
244	OnePlus Ace Pro	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856649/phone_shop/products/vmkcj9vsnqppzyfqltvh.webp	2026-10-01 19:10:50.281+07	2026-10-01 19:10:50.281+07	21
245	OnePlus Nord 2T	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856650/phone_shop/products/yzmrkzokakgghxxktfb0.webp	2026-10-01 19:10:51.648+07	2026-10-01 19:10:51.648+07	21
246	TCL 40 NXT PAPER 8GB 256GB	4490000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856651/phone_shop/products/pf0pyuc6aaiccegd4hv9.webp	2026-10-01 19:10:53.024+07	2026-10-01 19:10:53.024+07	22
247	TCL 406S 4GB 64GB	1990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856653/phone_shop/products/c5exj3vearpayldyudbh.webp	2026-10-01 19:10:54.612+07	2026-10-01 19:10:54.612+07	22
248	TCL 40SE 4GB 128GB	3390000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856655/phone_shop/products/baifkw0b3v6yflacgegg.webp	2026-10-01 19:10:56.077+07	2026-10-01 19:10:56.077+07	22
249	TCL 408 4GB 64GB	2290000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856656/phone_shop/products/xxw4yryjhh174vdibuqm.webp	2026-10-01 19:10:57.739+07	2026-10-01 19:10:57.739+07	22
250	TCL 505	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856658/phone_shop/products/aprudzvix4nphiornns8.webp	2026-10-01 19:10:59.25+07	2026-10-01 19:10:59.25+07	22
251	TCL 50SE	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856659/phone_shop/products/kydxy8fzlds1omlsvpwi.webp	2026-10-01 19:11:00.799+07	2026-10-01 19:11:00.799+07	22
252	TCL 40SE 6GB 256GB	3990000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856661/phone_shop/products/sp3jac00nxv7dshkaimi.webp	2026-10-01 19:11:02.162+07	2026-10-01 19:11:02.162+07	22
253	TCL 408 4GB 128GB	2390000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856662/phone_shop/products/getocfnjpxvmgbuz0y74.webp	2026-10-01 19:11:03.76+07	2026-10-01 19:11:03.76+07	22
254	Benco S1 Pro 8GB 256GB	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856664/phone_shop/products/vj6bbftji8xyh2ai960q.webp	2026-10-01 19:11:05.178+07	2026-10-01 19:11:05.178+07	23
255	ASUS ROG Phone 6 Mediatek	NaN	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856665/phone_shop/products/wlauqi5svvpivbgpxgm8.webp	2026-10-01 19:11:07.042+07	2026-10-01 19:11:07.042+07	24
256	ASUS ZenFone Max Pro M2 3GB	5290000.00	20	\N	https://res.cloudinary.com/dmjxgbywe/image/upload/v1790856667/phone_shop/products/mhlxvwtoxcmp2hctkssi.webp	2026-10-01 19:11:08.409+07	2026-10-01 19:11:08.409+07	24
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, role, "createdAt", "updatedAt", email) FROM stdin;
1	admin	$2b$10$ikwIwvhDKyo7thwaDbIRYODcb..xVmLYdVw7KvRn2XIb7TbAmoKA2	admin	2026-09-25 13:57:11.568+07	2026-09-25 13:57:11.568+07	admin123@gmail.com
2	tuanloc	$2b$10$3vZePfrZDkMXO682rxt1aOzG/gtumw7CvzD7Z2Q28Khuhc7mD/zem	customer	2026-09-25 14:35:34.281+07	2026-09-25 14:35:34.281+07	locletuan5@gmail.com
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 24, true);


--
-- Name: orderitems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orderitems_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 256, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: orderitems orderitems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT orderitems_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- Name: users users_email_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key43 UNIQUE (email);


--
-- Name: users users_email_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key44 UNIQUE (email);


--
-- Name: users users_email_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key45 UNIQUE (email);


--
-- Name: users users_email_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key46 UNIQUE (email);


--
-- Name: users users_email_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key47 UNIQUE (email);


--
-- Name: users users_email_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key48 UNIQUE (email);


--
-- Name: users users_email_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key49 UNIQUE (email);


--
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- Name: users users_email_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key50 UNIQUE (email);


--
-- Name: users users_email_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key51 UNIQUE (email);


--
-- Name: users users_email_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key52 UNIQUE (email);


--
-- Name: users users_email_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key53 UNIQUE (email);


--
-- Name: users users_email_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key54 UNIQUE (email);


--
-- Name: users users_email_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key55 UNIQUE (email);


--
-- Name: users users_email_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key56 UNIQUE (email);


--
-- Name: users users_email_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key57 UNIQUE (email);


--
-- Name: users users_email_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key58 UNIQUE (email);


--
-- Name: users users_email_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key59 UNIQUE (email);


--
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- Name: users users_email_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key60 UNIQUE (email);


--
-- Name: users users_email_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key61 UNIQUE (email);


--
-- Name: users users_email_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key62 UNIQUE (email);


--
-- Name: users users_email_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key63 UNIQUE (email);


--
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: orderitems orderitems_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT orderitems_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orderitems orderitems_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT orderitems_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict MfIjX7jBHf9vxtpCo6su8EiVlOf63r3KhV5B7ZeoxMC6lpiLlV7JZbcFRXAcChR

