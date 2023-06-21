class Matrix4x4
{
    constructor(c0, c1, c2, c3)
    {
        this.c0 = c0;
        this.c1 = c1;
        this.c2 = c2;
        this.c3 = c3;
    }

    TransformPoint(v)
    {
        return new Vec3(v.x*this.c0.x + v.y*this.c1.x + v.z*this.c2.x + this.c3.x,
                        v.x*this.c0.y + v.y*this.c1.y + v.z*this.c2.y + this.c3.y,
                        v.x*this.c0.z + v.y*this.c1.z + v.z*this.c2.z + this.c3.z);
    }

    TransformDirection(v)
    {
        return new Vec3(v.x*this.c0.x + v.y*this.c1.x + v.z*this.c2.x,
                        v.x*this.c0.y + v.y*this.c1.y + v.z*this.c2.y,
                        v.x*this.c0.z + v.y*this.c1.z + v.z*this.c2.z);
    }

    MultiplyMatrix4x4(m)
    {
        let newC0 = new Vec3(this.c0.x*m.c0.x + this.c1.x*m.c0.y + this.c2.x*m.c0.z,
                             this.c0.y*m.c0.x + this.c1.y*m.c0.y + this.c2.y*m.c0.z,
                             this.c0.z*m.c0.x + this.c1.z*m.c0.y + this.c2.z*m.c0.z);

        let newC1 = new Vec3(this.c0.x*m.c1.x + this.c1.x*m.c1.y + this.c2.x*m.c1.z,
                             this.c0.y*m.c1.x + this.c1.y*m.c1.y + this.c2.y*m.c1.z,
                             this.c0.z*m.c1.x + this.c1.z*m.c1.y + this.c2.z*m.c1.z);

        let newC2 = new Vec3(this.c0.x*m.c2.x + this.c1.x*m.c2.y + this.c2.x*m.c2.z,
                             this.c0.y*m.c2.x + this.c1.y*m.c2.y + this.c2.y*m.c2.z,
                             this.c0.z*m.c2.x + this.c1.z*m.c2.y + this.c2.z*m.c2.z);

        let newC3 = new Vec3(this.c0.x*m.c3.x + this.c1.x*m.c3.y + this.c2.x*m.c3.z + this.c3.x,
                             this.c0.y*m.c3.x + this.c1.y*m.c3.y + this.c2.y*m.c3.z + this.c3.y,
                             this.c0.z*m.c3.x + this.c1.z*m.c3.y + this.c2.z*m.c3.z + this.c3.z);

        return new Matrix4x4(newC0, newC1, newC2, newC3);
    }

    MultiplyMatrix4x4Self(m)
    {
        let newC0 = new Vec3(this.c0.x*m.c0.x + this.c1.x*m.c0.y + this.c2.x*m.c0.z,
                             this.c0.y*m.c0.x + this.c1.y*m.c0.y + this.c2.y*m.c0.z,
                             this.c0.z*m.c0.x + this.c1.z*m.c0.y + this.c2.z*m.c0.z);

        let newC1 = new Vec3(this.c0.x*m.c1.x + this.c1.x*m.c1.y + this.c2.x*m.c1.z,
                             this.c0.y*m.c1.x + this.c1.y*m.c1.y + this.c2.y*m.c1.z,
                             this.c0.z*m.c1.x + this.c1.z*m.c1.y + this.c2.z*m.c1.z);

        let newC2 = new Vec3(this.c0.x*m.c2.x + this.c1.x*m.c2.y + this.c2.x*m.c2.z,
                             this.c0.y*m.c2.x + this.c1.y*m.c2.y + this.c2.y*m.c2.z,
                             this.c0.z*m.c2.x + this.c1.z*m.c2.y + this.c2.z*m.c2.z);

        let newC3 = new Vec3(this.c0.x*m.c3.x + this.c1.x*m.c3.y + this.c2.x*m.c3.z + this.c3.x,
                             this.c0.y*m.c3.x + this.c1.y*m.c3.y + this.c2.y*m.c3.z + this.c3.y,
                             this.c0.z*m.c3.x + this.c1.z*m.c3.y + this.c2.z*m.c3.z + this.c3.z);

        this.c0 = newC0;
        this.c1 = newC1;
        this.c2 = newC2;
        this.c3 = newC3;
    }
}