import styles from "./Community.module.css";

const data = [
  {
    id: 15,
    user: "wonjae",
    title: "안녕",
    category: null,
    content: "작성자는?",
    create_dt: "2022-04-19T21:21:11.541097+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 14,
    user: "채걸",
    title: "안녕안녕 나는 어드민~",
    category: 1,
    content: "어드민 포스팅이다",
    create_dt: "2022-04-19T21:17:40.232225+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 13,
    user: "백준선",
    title: "자유주제 게시글",
    category: 1,
    content: "짧은 글을 담은 게시글",
    create_dt: "2022-04-19T20:05:43.683558+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 12,
    user: "누구게",
    title: "안녕안녕 나는 누구누구야",
    category: null,
    content: "로그인 누구야qq",
    create_dt: "2022-04-19T13:33:05.081578+09:00",
    like: 2851,
    view_count: 10573,
  },
  {
    id: 11,
    user: 1,
    title: "안녕",
    category: null,
    content: "로그인 누구야asas",
    create_dt: "2022-04-19T13:32:46.521494+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 10,
    user: 1,
    title: "안녕",
    category: null,
    content: "로그인 누구야",
    create_dt: "2022-04-19T13:31:11.045278+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 9,
    user: 1,
    title: "안녕",
    category: null,
    content: "로그인 누구야",
    create_dt: "2022-04-19T13:30:52.915929+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 8,
    user: 1,
    title: "안녕",
    category: null,
    content: "로그인 누구야",
    create_dt: "2022-04-19T13:28:31.703395+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 7,
    user: 1,
    title: "안녕",
    category: null,
    content: "로그인 누구야",
    create_dt: "2022-04-19T13:24:26.689477+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 6,
    user: 1,
    title: "안녕",
    category: null,
    content: "유저네임 뭘로나올까?",
    create_dt: "2022-04-19T13:22:33.522716+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 5,
    user: 1,
    title: "안녕",
    category: null,
    content: "유저네임 뭘로나올까?",
    create_dt: "2022-04-19T11:57:12.166568+09:00",
    like: 0,
    view_count: 1,
  },
  {
    id: 4,
    user: 1,
    title: "안녕",
    category: null,
    content: "로그인 누구야",
    create_dt: "2022-04-19T11:54:05.507790+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 3,
    user: 1,
    title: "안녕",
    category: null,
    content: "로그인 누구야",
    create_dt: "2022-04-19T11:53:27.912353+09:00",
    like: 0,
    view_count: 3,
  },
  {
    id: 2,
    user: 1,
    title: "게시글 2",
    category: null,
    content: "게시글2",
    create_dt: "2022-04-18T14:06:48.176595+09:00",
    like: 4,
    view_count: 24,
  },
  {
    id: 1,
    user: 4,
    title: "게시글 1",
    category: null,
    content: "게시글 2",
    create_dt: "2022-04-18T14:06:30.846319+09:00",
    like: 2,
    view_count: 13,
  },
];
const pagecnt = 10;
const curpage = 1;

const Community = () => {
  return (
    <div className={styles.container}>
      <a href="">
        <img className={styles.logo} src="aivle.png" />
      </a>
      <nav className={styles.navigator}>
        <img className={styles.profile} src="king.png" />
        <h5 id="id">아이디</h5>
        <a href="">
          <img src="google.png" />
        </a>
        <a href="">
          <img src="google.png" />
        </a>
      </nav>
      <nav className={styles.menu}>
        <a href="">자유게시판</a>
        <a href="">다른게시판</a>
        <a href="http://localhost:3000/main">메인으로</a>
      </nav>
      <div className={styles.post}>
        {data.map((data) => {
          return (
            <div className={styles.post_num}>
              <div id={styles.number}>{data["id"]}</div>
              <div id={styles.title}>
                <a href="">{data["title"]}</a>
              </div>
              <div id={styles.user_id}>{data["user"]}</div>
              <div id={styles.date}>{data["create_dt"].slice(5, 10)}</div>
              <div id={styles.like}>
                <img src="https://emojigraph.org/media/twitter/red-heart_2764-fe0f.png" />
                {data["like"]}
              </div>
              <div id={styles.view}>
                <img src="https://cdn2.iconfinder.com/data/icons/picol-vector/32/view-512.png" />
                {data["view_count"]}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.footer}>
        <div className={styles.write}>
          <a href="">
            <button>글쓰기</button>
          </a>
        </div>
        <div className={styles.page}>
          <navi></navi>
        </div>
      </div>
    </div>
  );
};

export default Community;
