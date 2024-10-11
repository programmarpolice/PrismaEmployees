const express = require("express");
const router = express.Router();
module.exports = router;
const prisma = require("..");

router.get("/", async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    if (employee) {
      res.json(employee);
    } else {
      next({ status: 404, message: `Employee with id ${id} does not exist.` });
    }
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  // Check if name was provided
  if (!name) {
    return next({
      status: 400,
      message: "A new name must be provided.",
    });
  }

  try {
    // Check if the employee exists
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    if (!employee) {
      return next({
        status: 404,
        message: `Employee with id ${id} does not exist.`,
      });
    }

    // Update the employee
    const updatedEmployee = await prisma.employee.update({
      where: { id: +id },
      data: { name },
    });
    res.json(updatedEmployee);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next({
      status: 400,
      message: "Employee name must be provided.",
    });
  }
  try {
    const employee = await prisma.employee.create({ data: { name } });
    res.status(201).json(employee);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the employee exists
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    if (!employee) {
      return next({
        status: 404,
        message: `Employee with id ${id} does not exist.`,
      });
    }

    // Delete the employee
    await prisma.employee.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});
