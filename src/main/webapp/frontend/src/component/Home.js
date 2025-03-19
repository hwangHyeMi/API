import ReactPlayer from 'react-player';

//          component: Join 컴포넌트          //
function Home() {
  return (
    <div>
      <ReactPlayer url={process.env.REACT_APP_PUBLIC_URL + '/assets/media/sushikooya.mp4'} width="100%" height="100%" playing={true} muted={true} controls={true} loop={true} />
    </div>
  );
}
export default Home;
