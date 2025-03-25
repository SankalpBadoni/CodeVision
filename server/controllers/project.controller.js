import Project from "../models/project.model.js";
import mongoose from "mongoose";

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description, files, messages, tags } = req.body;
    
    // Validate required fields
    if (!name || !files) {
      return res.status(400).json({
        success: false,
        message: "Project name and files are required"
      });
    }
    
    // Create project with user ID from authenticated user
    const newProject = new Project({
      name,
      description,
      files,
      messages: messages || [],
      tags: tags || [],
      userId: req.user.id, // This assumes authentication middleware sets req.user
    });
    
    const savedProject = await newProject.save();
    
    res.status(201).json({
      success: true,
      project: savedProject
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message
    });
  }
};

// Get all projects for the authenticated user
export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id })
      .sort({ updatedAt: -1 }) // Most recent first
      .select("-files"); // Exclude files to reduce payload size
    
    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message
    });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID"
      });
    }
    
    const project = await Project.findById(projectId);
    
    // Check if project exists
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    // Check if user is authorized to access this project
    if (project.userId.toString() !== req.user.id && !project.isPublic) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this project"
      });
    }
    
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message
    });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateData = req.body;
    
    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID"
      });
    }
    
    // Find the project
    const project = await Project.findById(projectId);
    
    // Check if project exists
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    // Check if user owns this project
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this project"
      });
    }
    
    // Update the lastModified date
    updateData.lastModified = Date.now();
    
    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true } // Return the updated document
    );
    
    res.status(200).json({
      success: true,
      project: updatedProject
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message
    });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID"
      });
    }
    
    // Find the project
    const project = await Project.findById(projectId);
    
    // Check if project exists
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    // Check if user owns this project
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this project"
      });
    }
    
    // Delete the project
    await Project.findByIdAndDelete(projectId);
    
    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message
    });
  }
}; 