
import IndexApp from "./app/IndexApp";

function Index({consultant,expertise,articles}) {
    return (
        <div>
            <IndexApp consultant={consultant} expertise={expertise} articles={articles}/>
        </div>
    );
}

export default Index;