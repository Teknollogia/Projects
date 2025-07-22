import NewTask from "./NewTask";

export default function Tasks({ tasks, onAdd, onDelete }) {
	return (
		<section>
			<h2 className="text-2xl font-bold text-stone-700 mb-4">
				Tasks
			</h2>
			<NewTask onAdd={onAdd} />
			{tasks.length ===0 &&  (<p className="text-stone-800 my-4">
				No tasks available
			</p>
			)}
			{tasks.length > 0 && (
				<ul className="p-4 m-8 rounded-md bg-stone-100">
					{tasks.map(task => (
						<li key={task.id} className="flex justify-between items-center py-2 border-b border-stone-200">
							<span className="text-stone-800">{task.text}</span>
							<button className="text-red-600 hover:text-red-800" onClick={() => onDelete(task.id)}>Clear</button>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}