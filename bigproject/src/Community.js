import { useState, useEffect } from "react";
import styles from "./Community.module.css";

const dat = [
  {
    id: 15,
    user: "김원재",
    title: "안녕",
    category: null,
    content: "작성자는?",
    create_dt: "2022-04-19T21:21:11.541097+09:00",
    like: 1,
    view_count: 2,
  },
  {
    id: 14,
    user: "김동현",
    title: "안녕안녕 나는 어드민~",
    category: 1,
    content: "어드민 포스팅이다",
    create_dt: "2022-04-19T21:17:40.232225+09:00",
    like: 3,
    view_count: 4,
  },
  {
    id: 13,
    user: "백준선",
    title: "자유주제 게시글",
    category: 1,
    content: "짧은 글을 담은 게시글",
    create_dt: "2022-04-19T20:05:43.683558+09:00",
    like: 5,
    view_count: 6,
  },
  {
    id: 12,
    user: "이현호",
    title: "안녕안녕 나는 누구야",
    category: null,
    content: "로그인 누구야qq",
    create_dt: "2022-04-19T13:33:05.081578+09:00",
    like: 7,
    view_count: 8,
  },
  {
    id: 11,
    user: "이소연",
    title: "Hello",
    category: null,
    content: "로그인 누구야asas",
    create_dt: "2022-04-19T13:32:46.521494+09:00",
    like: 9,
    view_count: 10,
  },
  {
    id: 10,
    user: "홍길동",
    title: "1루수가 누구야",
    category: null,
    content: "로그인 누구야",
    create_dt: "2022-04-19T13:31:11.045278+09:00",
    like: 16545,
    view_count: 416543,
  },
  {
    id: 9,
    user: "LHH",
    title: "2루수는 뭐야",
    category: null,
    content: "로그인 누구야",
    create_dt: "2022-04-19T13:30:52.915929+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 8,
    user: "어나니머스",
    title: "33333333333333333333",
    category: null,
    content: "로그인 누구야",
    create_dt: "2022-04-19T13:28:31.703395+09:00",
    like: 0,
    view_count: 0,
  },
  {
    id: 7,
    user: 1,
    title: "하기싫다아아ㅏ아아아",
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

const Community = () => {
  const [data, setData] = useState([]);
  const [pagelist, setPagelist] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [totpage, setTotpage] = useState(34);
  const [curpage, setCurpage] = useState(1);
  let p = [];

  const right_btn = () => {
    for (let i = 0; i < 10; i++) {
      p[i] = pagelist[i] + 10;
    }
    console.log(p);
    setPagelist(p);
  };

  const left_btn = () => {
    for (let i = 0; i < 10; i++) {
      p[i] = pagelist[i] - 10;
    }
    console.log(p);
    setPagelist(p);
  };

  const pagenate = () => {
    pagelist.map((num) => {
      return <a href="">{num}</a>;
    });
  };

  useEffect(() => {
    setData(dat);
  }, []);

  return (
    <div className={styles.container}>
      <img src="aivle.png" className={styles.logo} />
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
      <div className={styles.post_title}>
        <div id={styles.number}></div>
        <div id={styles.title}>제목</div>
        <div id={styles.user_id}>ID</div>
        <div id={styles.date}>날짜</div>
        <div id={styles.like}>좋아요</div>
        <div id={styles.view}>조회수</div>
      </div>
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
          <button onClick={left_btn}>◀</button>
          {pagelist.map((num) => {
            return <a href="">{num}</a>;
          })}
          <button onClick={right_btn}>▶</button>
        </div>
        <div className={styles.search}>
          <input placeholder="검색" />
        </div>
      </div>
    </div>
  );
};

export default Community;
