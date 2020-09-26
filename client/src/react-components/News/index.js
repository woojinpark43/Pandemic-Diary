import React from "react";
import "./styles.css";

/**
 * A NewsArticle to be displayed in the News container.
 *
 * Props:
 *  - article: Object that describes this article. Must have attributes:
 *      - title
 *      - content
 *      - link
 */
class NewsArticle extends React.Component {
    render() {
        const a = this.props.article;
        return (
            <a href={a.url} className="news-article">
                <p className="news-article-title">{a.title}</p>
                {a.description}
                {a.urlToImage ? (
                    <img
                        src={a.urlToImage}
                        alt={a.description}
                        onError={(e) => e.preventDefault()}
                    />
                ) : null}
            </a>
        );
    }
}

/**
 * News panel to be displayed in a container.
 *
 * Props:
 *  - currentDate: the date to fetch news articles for.
 */
class News extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            statusString: "Loading news for the day...",
        };

        this.abortFetch = new AbortController();
    }

    componentDidMount() {
        this.getArticles(this.props.currentDate);
    }

    componentWillUnmount() {
        this.abortFetch.abort();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentDate !== this.props.currentDate) {
            if (this.props.currentDate < new Date()) {
                this.setState({
                    statusString: "Loading news for the day...",
                    articles: [],
                });
                this.getArticles(this.props.currentDate);
            }
        }
    }

    getArticles(date) {
        fetch(
            `/news?date=${new Date(date.toDateString())}`,
            { signal: this.abortFetch.signal },
            {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
            }
        )
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ statusString: "" });
                    return res.json();
                } else if (res.status === 429) {
                    this.setState({
                        statusString:
                            "Slow down! You may only view the news for 10 days per minute.",
                    });
                    return [];
                } else {
                    this.setState({
                        statusString: "Some error occurred :( Please try again later.",
                    });
                    return [];
                }
            })
            .then((val) => {
                this.setState({
                    articles: val,
                });
            }).catch(err => {});
    }

    render() {
        return this.state.articles?.length ? (
            this.props.currentDate < new Date() ? (
                <div className="news-container">
                    {this.state.articles.map((a, i) => (
                        <NewsArticle key={i} article={a} />
                    ))}
                </div>
            ) : (
                "You can't view news from the future!"
            )
        ) : (
            <div className="news-container">{this.state.statusString}</div>
        );
    }
}

export default News;
