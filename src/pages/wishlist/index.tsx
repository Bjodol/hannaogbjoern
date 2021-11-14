import Container from "../../../components/container";
import Header from "../../../components/header";

const WishlistPage: React.FC = () => {
  return (
    <Container>
      <Header />
      <h1 className="text-2xl sm:text-6xl text-center">
        🚧 Under konstruksjon 🚧
      </h1>
      <p className="text-center py-4">Nyt disse dansende Bjørnene så lenge.</p>
      <iframe
        width="1196"
        height="673"
        src="https://www.youtube.com/embed/l6yuv_-I4Z0?start=49&autoplay=1&mute=0&loop=1"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </Container>
  );
};

export default WishlistPage;
