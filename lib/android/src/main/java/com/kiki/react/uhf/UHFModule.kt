package com.kiki.react.uhf

import android.content.pm.PackageManager
import android.os.RemoteException
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.olc.uhf.UhfAdapter
import com.olc.uhf.tech.ISO1800_6C
import com.olc.uhf.tech.IUhfCallback

val TAG = "kiki"
val ModuleName = "UHFModule"

class RNUHFModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    var eventEmitter: DeviceEventManagerModule.RCTDeviceEventEmitter? = null

    var uhf_6c: ISO1800_6C? = null

    var reactContext: ReactContext? = null

    var loop = false
    var first = true

    val mUHFOption = UHFOption()

    init {
        this.reactContext = reactContext
    }

    override fun getName(): String {
        return ModuleName
    }

    @ReactMethod
    fun supportUHF(promise: Promise) {
        val pm = this.reactContext!!.getPackageManager()
        val nfcSupport = pm.hasSystemFeature(PackageManager.FEATURE_NFC)
        val mService = UhfAdapter.getUhfManager(this.reactContext)

        promise.resolve(nfcSupport && mService != null)
    }

    @ReactMethod
    fun initUHF(option: ReadableMap) {
        val mService = UhfAdapter.getUhfManager(this.reactContext)
        uhf_6c = mService.isO1800_6C
        eventEmitter = this.reactContext!!.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)

        if (option.hasKey("interval")) {
            mUHFOption.interval = option.getInt("interval")
        }

    }

    @ReactMethod
    fun readerStart() {
        loop = true
        val reader = this.reader()
        reader.start()
    }

    @ReactMethod
    fun readerStop() {
        loop = false
    }

    @ReactMethod
    fun getCurrentState(): Boolean {
        return loop
    }

    private fun reader(): Thread {
        val thread = Thread(Runnable {
            while (loop) {
                uhf_6c!!.inventory(callback)

                if (!loop) {
                    break
                }

                try {
                    Log.d(TAG, mUHFOption.interval.toLong().toString())
                    Thread.sleep(mUHFOption.interval.toLong());
                } catch (e: InterruptedException) {
                    Log.d(TAG, "enter InterruptedException")
                }

            }
        })

        return thread
    }

    private val callback: IUhfCallback = object : IUhfCallback.Stub() {
        @Throws(RemoteException::class)
        override fun doInventory(str: List<String>) {
            Log.d(TAG, "enter callback" + str.toString())

            str.forEach { it ->
                Log.d(TAG, "strepc origin=" + it)
                Log.d(TAG, "RSSI=" + it.substring(0, 2))
                Log.d(TAG, "PC=" + it.substring(2, 6))
                Log.d(TAG, "EPC=" + it.substring(6))
                Log.d(TAG, "Capitalization EPC= " + it.substring(2, 6) + it.substring(6))
            }

            eventEmitter!!.emit("reader", Arguments.fromList(str))

        }

        @Throws(RemoteException::class)
        override fun doTIDAndEPC(str: List<String>) {

        }

    }

}
