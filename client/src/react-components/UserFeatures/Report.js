import React from "react";

class ReportMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reportMessage: "",
        };
    }

    inputRef = React.createRef();

    componentDidUpdate() {
        if (this.props.shouldClear) {
            this.inputRef.current.value = "";
            this.props.onPopupExit();
        }
    }

    reportMarker = () => {
        fetch(`/reports`, {
            method: "post",
            body: JSON.stringify({shareable: this.props.selectedShareable, 
                reportMessage: this.state.reportMessage}),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    //should set some kind of successful share on front end here
                    this.props.returnToApp();
                }
            })
            .catch((err) => console.log(err));
    }

    render() {
        return (
            <>
                <h1 className="popupBox_title">Report Marker:</h1>
                <p className="popupBox_instructions">
                    You may report a marker that contains offensive content here. Enter a brief
                    message detailing what the issue with the marker is, and it will be handled by
                    our administrators.
                </p>
                <p className="popupBox_instructions">
                    Press "Enter" to submit the report when you're done.
                </p>
                <form>
                    <textarea
                        ref={this.inputRef}
                        className="text_area"
                        onChange={(e) => this.setState({ reportMessage: e.target.value })}
                        onKeyPress={(event) => {
                            //should probably notify the user that the report has been sent
                            if (event.key === "Enter") {
                                this.reportMarker()
                            }
                        }}></textarea>
                </form>
            </>
        );
    }
}

class ManageReports extends React.Component {
    state = {
        reports: [],
    }

    componentDidMount(){
        this.getReports()
    }

    getReports = () => {
        fetch(`/reports`)
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    reports: json,
                })
            })
            .catch((err) => console.log(err));
    }
    
    ignoreReport = (report) => {
        fetch(`/report`, {
            method: "delete",
            body: JSON.stringify({
                reportID: report._id,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    this.getReports();
                }
            })
            .catch((err) => console.log(err));
    }

    deleteShareable = (shareable) => {
        const id = shareable._id;

        fetch(`/shareable/${id}`, {
            method: "delete",
        })
            .then((res) => {
                if (res.status === 200) {
                    this.ignoreReport(shareable);
                    this.props.renderMap();
                }
            })
            .catch((err) => console.log(err));
    }

    renderReport(report) {
        return (
            <div>
                <button id="remove" title="Delete the reported marker" onClick={() => {
                    this.deleteShareable(report.report)
                    }}><i class="fas fa-trash"></i></button>
                <button id="remove" title="Remove report" onClick={() => {
                    this.ignoreReport(report.report)
                    }}><i class="fas fa-minus-circle"></i></button>
                <div className="content">Marker Content: 
                    <p>
                        {report.report.content ||
                    <img style={{width: "100%"}} src={report.report.image_url} alt="User-submitted content"/>}
                    </p></div>
                <div className="content">Report Message: <p>{report.reportMessage}</p></div>
                {/* <button onClick={() => this.props.deleteReportedShareable(report.shareable)}>Delete Report</button> */}
            </div>
        );
    }
    render() {
        return (
            <>
                <h3>Reports</h3>
                <div className="content_container">
                {this.state.reports.map((report) => this.renderReport(report))}
                </div>
            </>
        );
    }
}

export { ReportMenu, ManageReports };
