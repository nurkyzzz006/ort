import scss from './Admin.module.scss'; 
const Admin = () => {
     return (
      <div id={scss.Admin}>
        <div className='container'>
         <div className={scss.content}>
           Admin 
         </div>
        </div>
      </div>
    );
};
export default Admin;