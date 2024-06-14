// {base_url}/redirect?status=0 Success

// const Redirect = () => {
// 	const queryParams = new URLSearchParams(window.location.search);
// 	const initialStatus = queryParams.get("status");
// 	const [status, setStatus] = useState(initialStatus);

// 	useEffect(() => {
// 		let statusMessage = "";
// 		if (status == 0) {
// 			statusMessage = "success";
// 		} else if (status == 1) {
// 			statusMessage = "fail ";
// 		}
// 		window.postMessage(
// 			{ type: "STATUS_UPDATE", status: statusMessage },
// 			"https://localhost:3002"
// 		);
// 		setTimeout(() => {
// 			console.log("@@@@ window close");
// 			window.close();
// 		}, 5000);
// 	}, [status]);

// 	return (
// 		<>
// 			<div>
// 				<h1>Redirect Page</h1>
// 				<p>Status: {status}</p>
// 			</div>
// 		</>
// 	);
// };

// export default Redirect;
