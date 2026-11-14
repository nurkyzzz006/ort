import Platform from "./home/Platform";
import Welcome from "./home/Welcome";
import Work from "./home/Work";
import scss from "./HomePage.module.scss";
const HomePage = () => {
  return (
    <div id={scss.HomePage}>
      <Welcome />
      <Work/>
      <Platform/>
    </div>
  );
};
export default HomePage;
