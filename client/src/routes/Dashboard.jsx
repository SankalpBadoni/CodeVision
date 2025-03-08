const Dashboard = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="pt-20">
        <h2 className="text-3xl font-bold mb-8">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project cards will go here */}
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
      </div>
    </div>
  )
}

const ProjectCard = () => (
  <div className="p-6 rounded-lg bg-gray-800/50 border border-gray-700">
    <h3 className="text-xl font-semibold mb-3">Project Name</h3>
    <p className="text-gray-400 mb-4">A brief description of the project...</p>
    <div className="flex space-x-4">
      <button className="text-purple-400 hover:text-purple-300">Edit</button>
      <button className="text-purple-400 hover:text-purple-300">View</button>
    </div>
  </div>
)

export default Dashboard 