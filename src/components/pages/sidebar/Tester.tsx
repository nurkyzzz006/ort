import scss from './Tester.module.scss'; 
const Tester = () => {
     return (
      <div id={scss.Tester}>
        <div className='container'>
         <div className={scss.content}>
           Tester 
         </div>
        </div>
      </div>
    );
};
export default Tester;