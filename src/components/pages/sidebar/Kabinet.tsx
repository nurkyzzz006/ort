import scss from './Kabinet.module.scss'; 
const Kabinet = () => {
     return (
      <div id={scss.Kabinet}>
        <div className='container'>
         <div className={scss.content}>
           Kabinet 
         </div>
        </div>
      </div>
    );
};
export default Kabinet;